import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { TransactionDetails } from "./transactionDetails.entity";

@Entity()
export class Transactions extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "money", nullable: false })
    amount: number;

    @Column({ nullable: false })
    narration: string;

    @Column({ default: false })
    is_flagged: boolean;

    @Column({
        type: "enum",
        enum: ["Processing", "Successful", "Failed"],
        default: "Processing",
    })
    status: string;

    @ManyToOne(() => User, (user) => user.transactions)
    user: User;

    @OneToMany(
        () => TransactionDetails,
        (transactionDetails) => transactionDetails.transaction,
    )
    transfers: TransactionDetails[];

    @CreateDateColumn({
        type: "timestamp with time zone",
        default: () => "NOW()",
    })
    created_at: Date;

    @UpdateDateColumn({
        type: "timestamp with time zone",
        default: () => "NOW()",
    })
    updated_at: Date;
}
