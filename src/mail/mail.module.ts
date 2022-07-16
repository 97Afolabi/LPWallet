import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { MailService } from "./services/mail.service";

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: configService.get<string>("MAIL_HOST"),
                    port: configService.get<number>("MAIL_PORT"),
                    secure: false,
                    auth: {
                        user: configService.get<string>("MAIL_USER"),
                        pass: configService.get<string>("MAIL_PASSWORD"),
                    },
                    tls: {
                        rejectUnauthorized: false,
                    },
                },
                defaults: {
                    from:
                        "LPWallet" + configService.get<string>("MAIL_ADDRESS"),
                },
            }),
        }),
    ],
    providers: [MailService],
    exports: [MailModule],
})
export class MailModule {}
