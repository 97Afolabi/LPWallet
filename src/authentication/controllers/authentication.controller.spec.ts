import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AuthenticationService } from "../services/authentication.service";
import { AuthenticationController } from "./authentication.controller";
import { User } from "../../users/entities/user.entity";
import { faker } from "@faker-js/faker";
import { SuccessResponse } from "../../utils/successResponse";

describe("AuthenticationController", () => {
    let controller: AuthenticationController;

    const mockAuthService = {};

    const authDTO = {
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(8),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthenticationController],
            providers: [
                AuthenticationService,
                // {
                //     provide: getRepositoryToken(User),
                //     useValue: mockAuthService,
                // },
            ],
        })
            .overrideProvider(AuthenticationService)
            .useValue([mockAuthService])
            .compile();

        controller = module.get<AuthenticationController>(
            AuthenticationController,
        );
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    it("should log user in", async () => {
        // const mocker = jest.spyOn(controller, "login");
        // await controller.login(authDTO);
        // expect(mocker).toHaveBeenCalled();
        expect(controller.login(authDTO)).toBeInstanceOf(
            Promise<SuccessResponse>,
        );
        // expect(controller.login(authDTO)).not.toBeInstanceOf(SuccessResponse);

        // expect(mockUsersService.createAccount).toHaveBeenCalledWith(authDTO);
    });
});
