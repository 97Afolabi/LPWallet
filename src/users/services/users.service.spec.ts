import { Test, TestingModule } from "@nestjs/testing";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { faker } from "@faker-js/faker";
import { UsersService } from "./users.service";
import { MailService } from "../../mail/services/mail.service";
import { UserRepository } from "../repository/user.repository";
import { OtpRepository } from "../repository/otp.repository";

describe("UsersService", () => {
    let service: UsersService;
    let returnTrueOtp: boolean = true;
    const mockUserRepository = {
        save: (user) =>
            Promise.resolve({
                id: faker.datatype.uuid(),
                user,
            }),
        update: (user) =>
            Promise.resolve({
                id: faker.datatype.uuid(),
                user,
            }),
        findOne: (user: unknown) =>
            Promise.resolve({
                id: faker.datatype.uuid(),
                ...registrationDto,
            }),
        hashPassword: () => {
            return "";
        },
    };
    const mockOtpRepository = {
        delete: () => {},
        saveOtp: (email: string) => Promise.resolve("string returned"),
        validateOtp: (email: string, token: string) => {
            if (returnTrueOtp) return Promise.resolve(true);
            return Promise.resolve(false);
        },
    };

    const mockEventEmitter: any = {
        emit: (activateAccount) => true,
    };

    const mockMailService = {
        confirmationMail: (
            email: string,
            fullName: string,
            token: string,
        ) => {},
    };

    const registrationDto = {
        email: faker.internet.email(),
        username: "janedoe",
        phone: "08031234567",
        first_name: "Jane",
        last_name: "Doe",
        password: "@Password123",
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: UserRepository,
                    useValue: mockUserRepository,
                },
                {
                    provide: OtpRepository,
                    useValue: mockOtpRepository,
                },
                {
                    provide: EventEmitter2,
                    useValue: mockEventEmitter,
                },
                {
                    provide: MailService,
                    useValue: mockMailService,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should create new account", async () => {
        const mocker = jest.spyOn(service, "createAccount");
        await service.createAccount(registrationDto);

        expect(mocker).toHaveBeenCalledWith(registrationDto);
    });

    it.todo("should activate new account");

    it.todo("should validate invalid credentials");

    it.todo("should return user's profile");
});
