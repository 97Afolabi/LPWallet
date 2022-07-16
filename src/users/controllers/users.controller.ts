import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
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
}
