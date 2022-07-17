import { ApiProperty } from "@nestjs/swagger";
import {
    IsNotEmpty,
    IsString,
    Length,
    Matches,
    MinLength,
} from "class-validator";

export class TransactionPinDTO {
    @ApiProperty()
    @Length(4, 4, { message: "Pin must be exactly 4 characters long" })
    @IsNotEmpty()
    pin: string;

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
