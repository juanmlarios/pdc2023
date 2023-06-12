import { Body, Controller, Param, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { plainToClass } from "class-transformer";
import { CreditCardService } from "./cc.service";
import { CCDetails, CCInfo, Transaction } from "./models";
import { CommandBus } from "@nestjs/cqrs";
import { InitCreditCardCommand } from "./cc.handlers";

@Controller("CreditCardAPI")
@ApiTags("CreditCardAPI")
export class CreditCardController {
  constructor(
    private readonly ccService: CreditCardService,
    private readonly _cbus: CommandBus
  ) {}

  @ApiOperation({ description: "Activate Credit Card" })
  @ApiResponse({ status: 200, description: "Activate Credit Card" })
  @Post("Initiatate")
  async init(@Body() ccInfo: CCDetails) {
    return await this._cbus.execute(
      new InitCreditCardCommand(ccInfo.id, ccInfo.tenantId, ccInfo.limit)
    );
  }

  @ApiOperation({ description: "Activate Credit Card" })
  @ApiResponse({ status: 200, description: "Activate Credit Card" })
  @Post("Activate")
  async activate(@Body() ccInfo: CCInfo) {
    return this.ccService.activate(ccInfo.id, ccInfo.tenantId);
  }

  @ApiOperation({ description: "Activate Credit Card" })
  @ApiResponse({ status: 200, description: "Activate Credit Card" })
  @Put(":id/DeActivate")
  async deactivate(@Param("id") id: string) {
    return this.ccService.deactivate(id);
  }

  @ApiOperation({ description: "Activate Credit Card" })
  @ApiResponse({ status: 200, description: "Activate Credit Card" })
  @Post(":id/Transaction")
  async transaction(@Param("id") id: string, @Body() transaction: Transaction) {
    return this.ccService.transaction(
      id,
      plainToClass(Transaction, transaction)
    );
  }
}
