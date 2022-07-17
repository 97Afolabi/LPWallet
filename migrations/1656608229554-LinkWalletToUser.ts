import { MigrationInterface, QueryRunner } from "typeorm";

export class LinkWalletToUser1656608229554 implements MigrationInterface {
    name = "LinkWalletToUser1656608229554";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "FK_922e8c1d396025973ec81e2a402" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user" DROP CONSTRAINT "FK_922e8c1d396025973ec81e2a402"`,
        );
    }
}
