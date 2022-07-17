import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { faker } from "@faker-js/faker";
import { AuthenticationService } from "./authentication.service";
import { UserRepository } from "../../users/repository/user.repository";

describe("AuthenticationService", () => {
    let service: AuthenticationService;

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
                // id: faker.datatype.uuid(),
                // ...registrationDto,
            }),
        verifyPassword: jest.fn(() => true),
    };

    const user = {
        userData: async () => {},
    };

    const jwtService = {
        hashAsync: () => {},
    };

    const configService = {};

    const authDto = {
        email: faker.internet.email(),
        password: "@Password123",
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthenticationService,
                {
                    provide: UserRepository,
                    useValue: mockUserRepository,
                },
                {
                    provide: JwtService,
                    useValue: jwtService,
                },
                {
                    provide: ConfigService,
                    useValue: configService,
                },
            ],
        }).compile();

        service = module.get<AuthenticationService>(AuthenticationService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("login", () => {
        it.todo("should return user's profile data");
    });

    it.todo("should validate invalid credentials");
});
