import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { validateEnv } from "./config/env.validation";
import database from "./config/database";
import auth from "./config/auth";
import { UsersModule } from "./users/users.module";
import { MailModule } from "./mail/mail.module";

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
        EventEmitterModule.forRoot(),
        MailModule,
        UsersModule,
        MailModule,
        UsersModule,
    ],
})
export class AppModule {}
