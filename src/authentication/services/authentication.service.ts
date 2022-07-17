import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { SuccessResponse } from "../../utils/successResponse";
import { UserRepository } from "../../users/repository/user.repository";
import { AuthDTO } from "../dto/auth.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthenticationService {
    logger = new Logger("Auth service");
    FAILURE_MESSAGE = "Unable to process request";

    constructor(
        @InjectRepository(UserRepository)
        private usersRepository: UserRepository,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async login(authDto: AuthDTO) {
        try {
            const user = await this.usersRepository.findOne({
                email: authDto.email,
            });

            if (!user) {
                throw new BadRequestException("Incorrect credentials provided");
            }

            const validCredentials = this.usersRepository.verifyPassword(
                authDto.password,
                user.password,
            );

            if (!validCredentials) {
                throw new BadRequestException("Incorrect credentials provided");
            }

            const data = await user.userData();

            const token = await this.jwtService.signAsync(data, {
                secret: this.configService.get<string>("JWT_SECRET"),
                expiresIn: "5h",
            });
            data["token"] = token;

            return new SuccessResponse("User authenticated successfully", data);
        } catch (error) {
            this.logger.error(error);
            throw new BadRequestException(error);
        }
    }
}
