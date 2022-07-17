import { Body, Controller, Patch, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiBody, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AuthUser } from "../../authentication/decorators/authuser.decorator";
import { UserAuthGuard } from "../../authentication/guards/user.guard";
import { User } from "../../users/entities/user.entity";
import { TransactionPinDTO } from "../dto/updateTransactionPin.dto";
import { TransferService } from "../services/transfer.service";

@ApiTags("Transfer")
@Controller("transfer")
@UseGuards(UserAuthGuard)
export class TransferController {
    constructor(private transferService: TransferService) {}

    @ApiOperation({
        summary: "Update transaction pin",
    })
    @ApiBody({
        type: TransactionPinDTO,
        description: "Update transaction pin",
    })
    @ApiBearerAuth()
    @Patch("pin")
    async updateTransactionPin(
        @Body() transactionPinDTO: TransactionPinDTO,
        @AuthUser() user: User,
    ) {
        return this.transferService.updateTransactionPin(
            transactionPinDTO,
            user.id,
        );
    }
}
