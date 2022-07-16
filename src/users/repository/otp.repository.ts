import { Logger } from "@nestjs/common";
import { EntityRepository, MoreThan, Repository } from "typeorm";
import * as moment from "moment";
import { Otp } from "../entities/otp.entity";

@EntityRepository(Otp)
export class OtpRepository extends Repository<Otp> {
    logger = new Logger("OTP repository");

    generateOtp(): string {
        return Math.floor(
            Math.random() * (999999 - 100000 + 1) + 100000,
        ).toString();
    }

    async saveOtp(email: string): Promise<string> {
        try {
            const token = this.generateOtp();
            await this.save({
                email,
                otp: token,
                expires_at: moment().add(30, "minutes").toDate(),
            });

            return token;
        } catch (error) {
            this.logger.error(error);
        }
    }

    async validateOtp(email: string, token: string): Promise<Otp> {
        return await this.findOne({
            where: [
                {
                    email,
                    otp: token,
                    expires_at: MoreThan(moment().toDate()),
                },
            ],
        });
    }
}
