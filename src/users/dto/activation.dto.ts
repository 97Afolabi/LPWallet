import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEmail, IsNotEmpty, Length } from "class-validator";

export class ActivationDTO {
    @ApiProperty()
    @IsDefined({ message: "Email required" })
    @IsEmail({}, { message: "Invalid email" })
    email: string;

    @ApiProperty()
    @Length(6, 6, { message: "Token must be exactly 6 characters long" })
    @IsNotEmpty()
    token: string;
}
