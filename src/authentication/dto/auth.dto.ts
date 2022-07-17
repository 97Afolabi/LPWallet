import { ApiProperty } from "@nestjs/swagger";
import {
    IsDefined,
    IsEmail,
    IsString,
    Matches,
    MinLength,
} from "class-validator";

export class AuthDTO {
    @ApiProperty()
    @IsDefined({ message: "Email required" })
    @IsEmail({}, { message: "Invalid email" })
    email: string;

    @ApiProperty()
    @IsString({ message: "Password required" })
    @MinLength(8, { message: "Password must be at least 8 characters long" })
    @Matches(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[`~!@#$%^&*()?;:{}<>?/+=_-])",
        "",
        {
            message:
                "Password must contain at least one uppercase, lowercase, number and, special character",
        },
    )
    password: string;
}
