import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MailModule } from "../mail/mail.module";
import { MailService } from "../mail/services/mail.service";
import { UsersController } from "./controllers/users.controller";
import { UsersService } from "./services/users.service";
import { UserRepository } from "./repository/user.repository";
import { OtpRepository } from "./repository/otp.repository";
import { WalletRepository } from "../transfer/repository/wallet.repository";

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => config.get("auth.jwt"),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([
            UserRepository,
            OtpRepository,
            WalletRepository,
        ]),
        MailModule,
    ],
    providers: [UsersService, MailService, ConfigService],
    controllers: [UsersController],
    exports: [UsersModule],
})
export class UsersModule {}
