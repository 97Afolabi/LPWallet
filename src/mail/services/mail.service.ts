import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

export enum MailType {
    OTP = "Verification",
    ALERT = "Transaction notification",
}

@Injectable()
export class MailService {
    logger = new Logger("MailService");

    constructor(
        private mailerService: MailerService,
        private configService: ConfigService,
    ) {}

    async sendMail(
        email: string,
        subject: string,
        content: string,
        type: MailType,
    ) {
        try {
            await this.mailerService.sendMail({
                to: email,
                from: this.configService.get<string>("MAIL_ADDRESS"),
                subject: `${subject} | LPWallet`,
                text: content,
            });

            this.logger.verbose(`${type} mail sent successfully to ${email}`);
        } catch (error) {
            this.logger.error(`Failed to send ${type} mail to ${email}`);
        }
    }

    async confirmationMail(email: string, fullName: string, token: string) {
        const content = `Hi ${fullName}, welcome to LPWallet!\nPlease use \n${token}\n to verify your email. Token expires in 30 minutes`;
        return await this.sendMail(
            email,
            "e-mail confirmation",
            content,
            MailType.OTP,
        );
    }

    async creditNotification(
        email: string,
        sender: string,
        recipient: string,
        amount: number,
        narration: string,
    ) {
        const content = `Hi ${recipient}!\nYou just received a transfer of $${amount} from ${sender}.\nNarration: ${narration}`;
        return await this.sendMail(
            email,
            "Credit notification",
            content,
            MailType.ALERT,
        );
    }

    async debitNotification(
        email: string,
        sender: string,
        recipient: string,
        amount: number,
        narration: string,
    ) {
        const content = `Hi ${sender}!\nYou just made a transfer of $${amount} to ${recipient}.\nNarration: ${narration}`;
        return await this.sendMail(
            email,
            "Debit notification",
            content,
            MailType.ALERT,
        );
    }
}
