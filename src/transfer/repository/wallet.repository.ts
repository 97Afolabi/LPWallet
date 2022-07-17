import { EntityRepository, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { Wallet } from "../entities/wallet.entity";

@EntityRepository(Wallet)
export class WalletRepository extends Repository<Wallet> {
    verifyPin(plain: string, hashed: string): boolean {
        return bcrypt.compareSync(plain, hashed);
    }

    hashPin(plain: string): string {
        return bcrypt.hashSync(plain, 11);
    }
}
