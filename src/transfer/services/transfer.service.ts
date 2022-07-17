import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SuccessResponse } from "../../utils/successResponse";
import { TransactionPinDTO } from "../dto/updateTransactionPin.dto";
import { UserRepository } from "../../users/repository/user.repository";
import { WalletRepository } from "../repository/wallet.repository";

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
}
