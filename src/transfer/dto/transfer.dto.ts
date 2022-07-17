import { ApiProperty } from "@nestjs/swagger";
import {
    IsNotEmpty,
    IsNumber,
    IsString,
    Length,
    Max,
    Min,
    MinLength,
} from "class-validator";

export class TransferDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(50, { message: "You cannot transfer an amount less than $50" })
    @Max(2000, { message: "You cannot transfer an amount greater than $2000" })
    amount: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    narration: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(4, 15)
    recipient: string;

    @ApiProperty()
    @IsNotEmpty()
    @Length(4, 4, { message: "Pin must be exactly 4 characters long" })
    pin: string;
}
