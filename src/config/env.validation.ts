import { IsNotEmpty, IsPort, IsString, validateSync } from "class-validator";
import { plainToClass } from "class-transformer";

class EnvironmentVariables {
    @IsNotEmpty()
    @IsString()
    JWT_SECRET: string;

    @IsNotEmpty()
    @IsString()
    POSTGRES_USER: string;

    @IsNotEmpty()
    @IsString()
    POSTGRES_PASSWORD: string;

    @IsNotEmpty()
    @IsString()
    POSTGRES_HOST: string;

    @IsNotEmpty()
    @IsPort()
    POSTGRES_PORT: string = "5432";

    @IsNotEmpty()
    @IsString()
    POSTGRES_DATABASE: string;
}

export function validateEnv(config: Record<string, unknown>) {
    const validatedConfig = plainToClass(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
}
