import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTransactionDetails1656650006530 implements MigrationInterface {
    name = 'CreateTransactionDetails1656650006530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transaction_details_transaction_type_enum" AS ENUM('Credit', 'Debit')`);
        await queryRunner.query(`CREATE TABLE "transaction_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "transaction_type" "public"."transaction_details_transaction_type_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "transactionId" uuid, "walletId" uuid, CONSTRAINT "PK_b9397af1203ca3a78ca6631e4b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "balance" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "transaction_details" ADD CONSTRAINT "FK_e54aea5ccd5291859159b4af5bf" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_details" ADD CONSTRAINT "FK_56e88d805bb9f716efef0ddec50" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_details" DROP CONSTRAINT "FK_56e88d805bb9f716efef0ddec50"`);
        await queryRunner.query(`ALTER TABLE "transaction_details" DROP CONSTRAINT "FK_e54aea5ccd5291859159b4af5bf"`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "balance" SET DEFAULT '$0.00'`);
        await queryRunner.query(`DROP TABLE "transaction_details"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_details_transaction_type_enum"`);
    }

}
