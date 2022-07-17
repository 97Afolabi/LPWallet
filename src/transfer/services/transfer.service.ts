import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SuccessResponse } from "../../utils/successResponse";
import { TransactionPinDTO } from "../dto/updateTransactionPin.dto";
import { UserRepository } from "../../users/repository/user.repository";
import { WalletRepository } from "../repository/wallet.repository";
import { TransactionsRepository } from "../repository/transactions.repository";
import { TransactionDetailsRepository } from "../repository/transactionDetails.repository";
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
}
