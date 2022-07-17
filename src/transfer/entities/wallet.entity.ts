import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToOne,
    OneToMany,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Wallet extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "uuid", nullable: false, unique: true })
    user_id: string;

    @Column({ type: "money", nullable: false, default: 0 })
    balance: number;

    @Column({ default: false })
    is_locked: boolean;

    @Column({ nullable: false, default: "1234" })
    pin: string;

    @OneToOne(() => User, (user) => user.wallet)
    @JoinColumn()
    user: User;

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
