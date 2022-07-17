import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVerificationOtp1656608154346 implements MigrationInterface {
    name = "CreateVerificationOtp1656608154346";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "verification_otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "otp" character varying(6) NOT NULL, "is_used" boolean NOT NULL DEFAULT false, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), CONSTRAINT "UQ_7b01fb66ccbe48876c7e496325d" UNIQUE ("email"), CONSTRAINT "PK_f2613d6f2ef8ccb28f3dccf4d5d" PRIMARY KEY ("id"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "verification_otp"`);
    }
}
