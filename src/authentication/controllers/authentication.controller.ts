import {
    Body,
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { ApiOperation, ApiBody, ApiTags } from "@nestjs/swagger";
import { AuthDTO } from "../dto/auth.dto";
import { AuthenticationService } from "../services/authentication.service";

@ApiTags("User authentication")
@Controller("auth")
export class AuthenticationController {
    constructor(private authService: AuthenticationService) {}

    @ApiOperation({
        summary: "User login",
    })
    @ApiBody({
        type: AuthDTO,
        description: "Authenticate user",
    })
    @Post()
    @UsePipes(ValidationPipe)
    async login(@Body() authDTO: AuthDTO) {
        return this.authService.login(authDTO);
    }
}
