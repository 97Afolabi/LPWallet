import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "../users/users.module";
import { AuthenticationService } from "./services/authentication.service";
import { AuthenticationController } from "./controllers/authentication.controller";
import { UserRepository } from "../users/repository/user.repository";

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => config.get("auth.jwt"),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([UserRepository]),
        UsersModule,
    ],
    providers: [AuthenticationService, JwtService, ConfigService],
    controllers: [AuthenticationController],
    exports: [JwtService],
})
export class AuthenticationModule {}
