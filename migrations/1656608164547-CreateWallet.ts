import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateWallet1656608164547 implements MigrationInterface {
    name = 'CreateWallet1656608164547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wallet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "balance" money NOT NULL DEFAULT '0', "is_locked" boolean NOT NULL DEFAULT false, "pin" character varying NOT NULL DEFAULT '1234', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), CONSTRAINT "UQ_72548a47ac4a996cd254b082522" UNIQUE ("user_id"), CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "wallet"`);
    }

}
