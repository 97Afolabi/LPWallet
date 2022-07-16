import { EntityRepository, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "../entities/user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    hashPassword(plainPassword: string): string {
        return bcrypt.hashSync(plainPassword, 11);
    }
}
