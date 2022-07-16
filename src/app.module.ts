import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { validateEnv } from "./config/env.validation";
import database from "./config/database";
import auth from "./config/auth";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [database, auth],
            ignoreEnvFile: false,
            validate: validateEnv,
            cache: true,
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => config.get("database"),
            inject: [ConfigService],
        }),
    ],
})
export class AppModule {}
