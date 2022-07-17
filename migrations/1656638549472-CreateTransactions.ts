import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTransactions1656638549472 implements MigrationInterface {
    name = 'CreateTransactions1656638549472'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transactions_status_enum" AS ENUM('Processing', 'Successful', 'Failed')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" money NOT NULL, "narration" character varying NOT NULL, "is_flagged" boolean NOT NULL DEFAULT false, "status" "public"."transactions_status_enum" NOT NULL DEFAULT 'Processing', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "balance" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "balance" SET DEFAULT '$0.00'`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
    }

}
