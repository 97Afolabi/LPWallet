import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    CreateDateColumn,
    ManyToOne,
} from "typeorm";
import { Transactions } from "./transactions.entity";
import { Wallet } from "./wallet.entity";

@Entity()
export class TransactionDetails extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "enum",
        enum: ["Credit", "Debit"],
        nullable: false,
    })
    transaction_type: string;

    @ManyToOne(() => Transactions, (transaction) => transaction.transfers)
    transaction: Transactions;

    @ManyToOne(() => Wallet, (wallet) => wallet.transfers)
    wallet: Wallet;

    @CreateDateColumn({
        type: "timestamp with time zone",
        default: () => "NOW()",
    })
    created_at: Date;
}
