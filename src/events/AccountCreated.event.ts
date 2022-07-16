export class AccountCreatedEvent {
    email: string;
    fullName: string;

    constructor(email: string, fullName: string) {
        this.email = email;
        this.fullName = fullName;
    }
}
