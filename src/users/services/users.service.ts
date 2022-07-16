import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { SuccessResponse } from "../../utils/successResponse";
import { RegistrationDTO } from "../dto/registration.dto";
import { UserRepository } from "../repository/user.repository";
import { MailService } from "../../mail/services/mail.service";
import { OtpRepository } from "../repository/otp.repository";
import { AccountCreatedEvent } from "../../events/AccountCreated.event";

@Injectable()
export class UsersService {
    logger = new Logger("User service");
    FAILURE_MESSAGE = "Unable to process request";

    constructor(
        @InjectRepository(UserRepository)
        private usersRepository: UserRepository,
        @InjectRepository(OtpRepository)
        private otpRepository: OtpRepository,
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

    @OnEvent("account.created")
    async sendConfirmationMail(payload: AccountCreatedEvent) {
        const token = await this.otpRepository.saveOtp(payload.email);

        await this.mailService.confirmationMail(
            payload.email,
            payload.fullName,
            token,
        );
    }
}
