import { Body, Controller, Param, Post } from "@nestjs/common";
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AzureMessageBus } from "common";
import { CreditCardIssued } from "./cc.account.events";
import { IsNumber, IsString } from "class-validator";

export class Limits {
  @ApiProperty()
  @IsNumber()
  public limit: number;

  @ApiProperty()
  @IsNumber()
  public interstRate: number;
}

@Controller("CreditCardAPI")
@ApiTags("CreditCardAPI")
export class CreditCardIssuerController {
  constructor(private azBus: AzureMessageBus) {}

  @ApiOperation({ description: "Activate Credit Card" })
  @ApiResponse({ status: 200, description: "Activate Credit Card" })
  @Post(":id/:tenantId/Issue")
  async issue(
    @Param("id") id: string,
    @Param("tenantId") tenantId: string,
    @Body() limits: Limits
  ) {
    this.azBus.send(
      {
        body: new CreditCardIssued({
          id,
          tenantId,
          version: 1,
          payload: limits,
        }),
      },
      "creditcardevents"
    );
  }
}
