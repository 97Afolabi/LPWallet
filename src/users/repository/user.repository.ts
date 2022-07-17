import { EntityRepository, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "../entities/user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async userLookup(identity: string) {
        return await this.findOne({
            where: [{ phone: identity }, { username: identity }],
            relations: ["wallet"],
        });
    }

    verifyPassword(plain: string, hashed: string): boolean {
        return bcrypt.compareSync(plain, hashed);
    }

    hashPassword(plainPassword: string): string {
        return bcrypt.hashSync(plainPassword, 11);
    }
}
