import { User } from "../users/entities/user.entity";

export class CreateWalletEvent {
    user: User;

    constructor(user: User) {
        this.user = user;
    }
}
