import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DatabaseConfig } from "../interfaces/dbConfig";
export const db = process.env as unknown as DatabaseConfig;

export default registerAs(
    "database",
    (): TypeOrmModuleOptions => ({
        type: "postgres",
        host: db.POSTGRES_HOST,
        port: db.POSTGRES_PORT,
        username: db.POSTGRES_USER,
        password: db.POSTGRES_PASSWORD,
        database: db.POSTGRES_DATABASE,
        entities: [__dirname + "/../**/*.entity.{js,ts}"],
        synchronize: false,
        autoLoadEntities: true,
        keepConnectionAlive: true,
    }),
);
