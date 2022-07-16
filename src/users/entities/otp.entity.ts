import {
    Entity,
    Column,
    BaseEntity,
    CreateDateColumn,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "verification_otp" })
export class Otp extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "character varying", nullable: false, unique: true })
    email: string;

    @Column({ type: "character varying", nullable: false, length: 6 })
    otp: string;

    @Column({ default: false })
    is_used: boolean;

    @Column({
        type: "timestamp with time zone",
        nullable: false,
    })
    expires_at: Date;

    @CreateDateColumn({
        type: "timestamp with time zone",
        default: () => "NOW()",
    })
    created_at: Date;
}
