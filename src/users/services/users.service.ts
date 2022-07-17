import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { SuccessResponse } from "../../utils/successResponse";
import { UserRepository } from "../repository/user.repository";
import { OtpRepository } from "../repository/otp.repository";
import { WalletRepository } from "../../transfer/repository/wallet.repository";
import { AccountCreatedEvent } from "../../events/AccountCreated.event";
import { CreateWalletEvent } from "../../events/CreateWallet.event";
import { RegistrationDTO } from "../dto/registration.dto";
import { ActivationDTO } from "../dto/activation.dto";
import { MailService } from "../../mail/services/mail.service";

@Injectable()
export class UsersService {
    logger = new Logger("User service");
    FAILURE_MESSAGE = "Unable to process request";

    constructor(
        @InjectRepository(UserRepository)
        private usersRepository: UserRepository,
        @InjectRepository(OtpRepository)
        private otpRepository: OtpRepository,
        @InjectRepository(WalletRepository)
        private walletRepository: WalletRepository,
        private eventEmitter: EventEmitter2,
        private mailService: MailService,
    ) {}

    async createAccount(
        registrationDto: RegistrationDTO,
    ): Promise<SuccessResponse> {
        try {
            registrationDto.password = this.usersRepository.hashPassword(
                registrationDto.password,
            );

            await this.usersRepository.save(registrationDto);

            this.eventEmitter.emit(
                "account.created",
                new AccountCreatedEvent(
                    registrationDto.email,
                    registrationDto.last_name,
                ),
            );

            return new SuccessResponse("Account created successfully");
        } catch (error) {
            this.logger.error(error);
            throw new BadRequestException(this.FAILURE_MESSAGE);
        }
    }

    async activateAccount(
        activationDTO: ActivationDTO,
    ): Promise<SuccessResponse> {
        try {
            const { email, token } = activationDTO;
            const validOtp = await this.otpRepository.validateOtp(email, token);

            if (!validOtp) {
                throw new BadRequestException("Incorrect validation data");
            }

            const activateAccount = await this.usersRepository.update(
                { email },
                { is_active: true },
            );

            if (!activateAccount) {
                throw new BadRequestException(this.FAILURE_MESSAGE);
            }

            await this.otpRepository.delete({ email, otp: token });

            const user = await this.usersRepository.findOne({ email });

            this.eventEmitter.emit(
                "create.wallet",
                new CreateWalletEvent(user),
            );

            return new SuccessResponse("Account activated successfully");
        } catch (error) {
            this.logger.error(error);
            throw new BadRequestException(error);
        }
    }

    @OnEvent("account.created")
    async sendConfirmationMail(payload: AccountCreatedEvent) {
        const token = await this.otpRepository.saveOtp(payload.email);

        await this.mailService.confirmationMail(
            payload.email,
            payload.fullName,
            token,
        );
    }

    @OnEvent("create.wallet")
    async createWallet(payload: CreateWalletEvent) {
        const createWallet = await this.walletRepository.save({
            user_id: payload.user.id,
            user: payload.user,
            balance: 5000, // credit wallet balance
        });

        // save wallet to user entity
        payload.user.wallet = createWallet;
        await payload.user.save();

        const username = createWallet.user.username;

        if (!createWallet) {
            this.logger.error(`Failed to create wallet for user: ${username}`);
        }
        this.logger.verbose(`Wallet created for user: ${username}`);
    }
}
