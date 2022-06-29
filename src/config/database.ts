import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ENV } from "../interfaces/env.interface";
export const ENV_VARIABLES = process.env as any as ENV;

export default registerAs(
    "database",
    (): TypeOrmModuleOptions => ({
        type: "postgres",
        url: ENV_VARIABLES.POSTGRES_URL,
        ssl: {
            rejectUnauthorized: false,
        },
        entities: [__dirname + "/../**/*.entity.{js,ts}"],
        synchronize: false,
        autoLoadEntities: true,
        keepConnectionAlive: true,
    }),
);
