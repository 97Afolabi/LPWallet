import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "../services/users.service";
import { UsersController } from "./users.controller";
import { SuccessResponse } from "../../utils/successResponse";

describe("UsersController", () => {
    let controller: UsersController;
    const registrationDto = {
        email: "jane@example.com",
        username: "janedoe",
        phone: "08031234567",
        first_name: "Jane",
        last_name: "Doe",
        password: "@Password123",
    };

    const mockUsersService = {
        createAccount: jest.fn(() => {
            return Promise<SuccessResponse>;
        }),
        activateAccount: jest.fn(),
        getProfile: jest.fn(() => {
            return Promise<SuccessResponse>;
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [UsersService],
        })
            .overrideProvider(UsersService)
            .useValue(mockUsersService)
            .compile();

        controller = module.get<UsersController>(UsersController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    it("should create new user's account", () => {
        expect(controller.createAccount(registrationDto)).toBeInstanceOf(
            Promise<SuccessResponse>,
        );

        expect(mockUsersService.createAccount).toHaveBeenCalledWith(
            registrationDto,
        );
    });

    it.todo("it should activate new user's account");

    it.todo("it should fetch user's profile");
});
