import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString, ValidateNested } from "class-validator";
import { Guid } from "guid-typescript";

// *****  CONTROLLER BODY ******//
export class CCInfo {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  tenantId: string;
}

// **********************************//

// *****  OBJECTS FOR AGGREGATE ******//
export class Transaction {
  public id: string;
  public date: number;

  @ApiProperty()
  @IsNumber()
  public amount: number;

  @ApiProperty()
  @IsString()
  public description: string;

  @ApiProperty()
  @IsString()
  public type: string;

  constructor() {
    this.date = Date.now();
    this.id = Guid.create().toString();
  }
}

export class Limits {
  @ApiProperty()
  @IsNumber()
  public limit: number;

  @ApiProperty()
  @IsNumber()
  public interstRate: number;
}

// **********************************//

// *****  RESPONSE FOR FEEDBACK  ******//

export class AggResponse {
  constructor(public message: string, public success: boolean) {}
}

// **********************************//

export class CCDetails extends CCInfo {
  @ApiProperty({ type: Limits })
  @ValidateNested()
  @Type(() => Limits)
  limit: Limits;
}
