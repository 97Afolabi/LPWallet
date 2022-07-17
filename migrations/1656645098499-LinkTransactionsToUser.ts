import {MigrationInterface, QueryRunner} from "typeorm";

export class LinkTransactionsToUser1656645098499 implements MigrationInterface {
    name = 'LinkTransactionsToUser1656645098499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "balance" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41"`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "balance" SET DEFAULT '$0.00'`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "userId"`);
    }

}
