import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ActivationDTO } from "../dto/activation.dto";
import { RegistrationDTO } from "../dto/registration.dto";
import { UsersService } from "../services/users.service";

@ApiTags("User account")
@Controller("users")
export class UsersController {
    constructor(private usersService: UsersService) {}

    @ApiOperation({
        summary: "Create new user's account",
    })
    @ApiBody({
        type: RegistrationDTO,
        description: "Store new user's account",
    })
    @Post("register")
    async createAccount(@Body() registrationDto: RegistrationDTO) {
        return this.usersService.createAccount(registrationDto);
    }

    @ApiOperation({
        summary: "Activate new user's account",
    })
    @ApiBody({
        type: ActivationDTO,
        description: "Activate user's account and create wallet",
    })
    @Post("activate")
    async activateAccount(@Body() activationDTO: ActivationDTO) {
        return this.usersService.activateAccount(activationDTO);
    }
}
