import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import database from "./config/database";
import auth from "./config/auth";
import { AuthenticationModule } from "./authentication/authentication.module";
import { UsersModule } from "./users/users.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [database, auth],
            ignoreEnvFile: false,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => config.get("database"),
            inject: [ConfigService],
        }),
        AuthenticationModule,
        UsersModule,
    ],
})
export class AppModule {}
