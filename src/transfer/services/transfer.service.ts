import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException,
} from "@nestjs/common";
import { getConnection, getManager } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { SuccessResponse } from "../../utils/successResponse";
import { TransferDTO } from "../dto/transfer.dto";
import { TransactionPinDTO } from "../dto/updateTransactionPin.dto";
import { User } from "../../users/entities/user.entity";
import { UserRepository } from "../../users/repository/user.repository";
import { WalletRepository } from "../repository/wallet.repository";
import { TransactionsRepository } from "../repository/transactions.repository";
import { TransactionDetailsRepository } from "../repository/transactionDetails.repository";
import { TransactionNotificationEvent } from "../../events/TransactionNotification.event";
import { MailService } from "../../mail/services/mail.service";

@Injectable()
export class TransferService {
    logger = new Logger("Transfer service");
    FAILURE_MESSAGE = "Unable to process request";

    constructor(
        @InjectRepository(UserRepository)
        private usersRepository: UserRepository,
        @InjectRepository(WalletRepository)
        private walletRepository: WalletRepository,
        @InjectRepository(TransactionsRepository)
        private transactionsRepository: TransactionsRepository,
        @InjectRepository(TransactionDetailsRepository)
        private transactionDetailsRepo: TransactionDetailsRepository,
        private eventEmitter: EventEmitter2,
        private mailService: MailService,
    ) {}

    async updateTransactionPin(
        transactionPinDTO: TransactionPinDTO,
        userId: string,
    ) {
        try {
            const user = await this.usersRepository.findOne({ id: userId });

            const validCredentials = this.usersRepository.verifyPassword(
                transactionPinDTO.password,
                user.password,
            );

            if (!validCredentials) {
                throw new BadRequestException("Incorrect password provided");
            }

            const hashedPin = this.walletRepository.hashPin(
                transactionPinDTO.pin,
            );

            await this.walletRepository.update(
                { user_id: userId },
                { pin: hashedPin },
            );

            user.has_set_pin = true;
            await user.save();

            return new SuccessResponse("Transaction pin updated successfully");
        } catch (error) {
            this.logger.error(error);
            throw new BadRequestException(error);
        }
    }

    async userLookup(identity: string): Promise<SuccessResponse> {
        try {
            const recipient = await this.usersRepository.userLookup(identity);

            if (!recipient || !recipient.wallet) {
                throw new NotFoundException("User not found");
            }

            return new SuccessResponse("Recipient's data", {
                firstName: recipient.first_name,
                lastName: recipient.last_name,
            });
        } catch (error) {
            this.logger.error(error);
            throw new BadRequestException(error);
        }
    }

    async transfer(
        transferDTO: TransferDTO,
        authUser: User,
    ): Promise<SuccessResponse> {
        try {
            const manager = getManager();

            const sender = await this.usersRepository.findOne({
                where: [{ id: authUser.id }],
                relations: ["wallet"],
            });

            if (!sender.has_set_pin) {
                throw new BadRequestException("Transaction pin not set");
            }

            if (sender.wallet.is_locked) {
                throw new ForbiddenException("Operation forbidden");
            }

            const validPin = this.usersRepository.verifyPassword(
                transferDTO.pin,
                sender.wallet.pin,
            );

            if (!validPin) {
                throw new BadRequestException("Incorrect pin provided");
            }

            const sendersWallet = await manager.query(
                `
                SELECT balance::numeric AS balance FROM wallet WHERE "id" = $1
            `,
                [sender.wallet.id],
            );

            if (sendersWallet[0].balance < transferDTO.amount) {
                throw new BadRequestException("Insufficient balance");
            }

            const receiver = await this.usersRepository.userLookup(
                transferDTO.recipient,
            );

            if (!receiver) {
                throw new BadRequestException("Invalid recipient");
            }

            if (receiver.wallet.is_locked) {
                throw new BadRequestException("Recipient's wallet locked");
            }

            if (receiver.wallet.id === sender.wallet.id) {
                throw new BadRequestException(
                    "You cannot transfer funds to yourself",
                );
            }

            await this.processTransfer(sender, receiver, transferDTO);

            return new SuccessResponse("Transfer successful");
        } catch (error) {
            this.logger.error(error);
            throw new BadRequestException(error);
        }
    }

    async processTransfer(
        sender: User,
        receiver: User,
        transferDTO: TransferDTO,
    ) {
        const { amount, narration } = { ...transferDTO };
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        await queryRunner.connect();

        const transaction = await this.transactionsRepository.save({
            amount,
            narration,
            user: sender,
        });

        await queryRunner.startTransaction();

        try {
            // debit sender's wallet
            await queryRunner.query(
                `
                UPDATE wallet
                    SET "balance" = "balance" - $1
                    WHERE "userId" = $2
            `,
                [amount, sender.id],
            );

            await this.transactionDetailsRepo.save({
                user: sender,
                transaction_type: "Debit",
                wallet: sender.wallet,
                transaction,
            });

            // credit recipient's wallet
            await queryRunner.query(
                `
                UPDATE wallet
                    SET "balance" = "balance" + $1
                    WHERE "userId" = $2
            `,
                [amount, receiver.id],
            );
            await this.transactionDetailsRepo.save({
                user: receiver,
                transaction_type: "Credit",
                wallet: receiver.wallet,
                transaction,
            });

            await this.transactionsRepository.update(
                { id: transaction.id },
                { status: "Successful" },
            );

            await queryRunner.commitTransaction();

            this.eventEmitter.emit(
                "send.alert",
                new TransactionNotificationEvent(
                    sender.email,
                    `${sender.last_name} ${sender.first_name}`,
                    `${receiver.last_name} ${receiver.first_name}`,
                    amount,
                    narration,
                    "Debit",
                ),
            );

            this.eventEmitter.emit(
                "send.alert",
                new TransactionNotificationEvent(
                    receiver.email,
                    `${sender.last_name} ${sender.first_name}`,
                    `${receiver.last_name} ${receiver.first_name}`,
                    amount,
                    narration,
                    "Credit",
                ),
            );

            this.logger.verbose(
                `Transaction: ${transaction.id} processed successfully`,
            );
        } catch (error) {
            await queryRunner.rollbackTransaction();

            await this.transactionsRepository.update(
                { id: transaction.id },
                { status: "Failed" },
            );
            this.logger.error(error);
            this.logger.warn(`Transaction: ${transaction.id} failed`);
        } finally {
            await queryRunner.release();
        }
    }

    @OnEvent("send.alert")
    async sendConfirmationMail(payload: TransactionNotificationEvent) {
        const { email, sender, recipient, amount, narration } = {
            ...payload,
        };
        if (payload.type === "Credit") {
            await this.mailService.creditNotification(
                email,
                sender,
                recipient,
                amount,
                narration,
            );
        }

        if (payload.type === "Debit") {
            await this.mailService.debitNotification(
                email,
                sender,
                recipient,
                amount,
                narration,
            );
        }
    }
}
