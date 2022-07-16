import { ApiProperty } from "@nestjs/swagger";
import {
    IsAlphanumeric,
    IsDefined,
    IsEmail,
    IsNotEmpty,
    IsPhoneNumber,
    IsString,
    Length,
    Matches,
    MinLength,
} from "class-validator";

export class RegistrationDTO {
    @ApiProperty()
    @IsDefined({ message: "Email required" })
    @IsEmail({}, { message: "Invalid email" })
    email: string;

    @ApiProperty()
    @Length(4, 15)
    @IsAlphanumeric()
    username: string;

    @ApiProperty()
    @IsDefined({ message: "Phone number required" })
    @IsPhoneNumber("NG", { message: "Invalid phone number" })
    phone: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    first_name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    last_name: string;

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
