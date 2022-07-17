type transactionType = "Credit" | "Debit";

export class TransactionNotificationEvent {
    email: string;
    sender: string;
    recipient: string;
    amount: number;
    narration: string;
    type: string;

    constructor(
        email: string,
        sender: string,
        recipient: string,
        amount: number,
        narration: string,
        type: transactionType,
    ) {
        this.email = email;
        this.sender = sender;
        this.recipient = recipient;
        this.amount = amount;
        this.narration = narration;
        this.type = type;
    }
}
