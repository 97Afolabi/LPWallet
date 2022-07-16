import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailModule } from "../mail/mail.module";
import { MailService } from "../mail/services/mail.service";
import { UsersController } from "./controllers/users.controller";
import { UsersService } from "./services/users.service";
import { UserRepository } from "./repository/user.repository";
import { OtpRepository } from "./repository/otp.repository";

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => config.get("auth.jwt"),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([UserRepository, OtpRepository]),
        MailModule,
    ],
    providers: [UsersService, MailService, ConfigService],
    controllers: [UsersController],
    exports: [UsersModule],
})
export class UsersModule {}
