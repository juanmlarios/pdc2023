import { Module, OnModuleInit } from "@nestjs/common";
import { CreditCardIssuerController } from "./cc.controller";

@Module({
  imports: [],
  controllers: [CreditCardIssuerController],
  providers: [],
})
export class CreditCardIssuerModule implements OnModuleInit {
  onModuleInit() {}
}
