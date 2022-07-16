import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "character varying", nullable: false, unique: true })
    email: string;

    @Column({ type: "character varying", nullable: false, unique: true })
    username: string;

    @Column({ nullable: false, unique: true })
    phone: string;

    @Column({ nullable: false })
    first_name: string;

    @Column({ nullable: false })
    last_name: string;

    @Column({ default: false })
    is_active: boolean;

    @Column({ default: false })
    has_set_pin: boolean;

    @Column({ nullable: false })
    password: string;

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

    async userData() {
        const data = {
            id: this.id,
            firstName: this.first_name,
            lastName: this.last_name,
            email: this.email,
            username: this.username,
            phone: this.phone,
            hasSetTransactionPin: this.has_set_pin,
            isActive: this.is_active,
            createdAt: this.created_at,
            wallet: null,
        };

        return data;
    }
}
