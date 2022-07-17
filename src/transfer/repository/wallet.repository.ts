import * as bcrypt from "bcrypt";
import { EntityRepository, Repository } from "typeorm";
import { Wallet } from "../entities/wallet.entity";

@EntityRepository(Wallet)
export class WalletRepository extends Repository<Wallet> {
    async userLookup(identity: string) {
        return await this.findOne({
            where: [
                { email: identity },
                { phone: identity },
                { username: identity },
            ],
        });
    }

    verifyPin(plain: string, hashed: string): boolean {
        return bcrypt.compareSync(plain, hashed);
    }

    hashPin(plain: string): string {
        return bcrypt.hashSync(plain, 11);
    }
}
