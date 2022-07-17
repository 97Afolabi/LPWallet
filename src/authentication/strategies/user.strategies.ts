import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "../../users/repository/user.repository";

@Injectable()
export class JwtUserStrategy extends PassportStrategy(
    Strategy,
    "jwt-user-strategy",
) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("JWT_SECRET"),
        });
    }

    async validate(payload: any) {
        const { id, email } = payload;
        const user = await this.userRepository.findOne({ email, id });

        if (!user) {
            throw new UnauthorizedException();
        }
        return payload;
    }
}
