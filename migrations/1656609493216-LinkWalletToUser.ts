import {MigrationInterface, QueryRunner} from "typeorm";

export class LinkWalletToUser1656609493216 implements MigrationInterface {
    name = 'LinkWalletToUser1656609493216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_922e8c1d396025973ec81e2a402"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "REL_922e8c1d396025973ec81e2a40"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "walletId"`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD CONSTRAINT "UQ_35472b1fe48b6330cd349709564" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "balance" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD CONSTRAINT "FK_35472b1fe48b6330cd349709564" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" DROP CONSTRAINT "FK_35472b1fe48b6330cd349709564"`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "balance" SET DEFAULT '$0.00'`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP CONSTRAINT "UQ_35472b1fe48b6330cd349709564"`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "walletId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "REL_922e8c1d396025973ec81e2a40" UNIQUE ("walletId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_922e8c1d396025973ec81e2a402" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
