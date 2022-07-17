import { forwardRef, Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { MailModule } from "../mail/mail.module";
import { WalletRepository } from "./repository/wallet.repository";
import { TransferService } from "./services/transfer.service";
import { TransferController } from "./controllers/transfer.controller";
import { UsersModule } from "../users/users.module";
import { UserRepository } from "../users/repository/user.repository";
import { MailService } from "../mail/services/mail.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([WalletRepository, UserRepository]),
        MailModule,
        forwardRef(() => UsersModule),
    ],
    providers: [TransferService, MailService, JwtService, ConfigService],
    controllers: [TransferController],
    exports: [TransferModule],
})
export class TransferModule {}
