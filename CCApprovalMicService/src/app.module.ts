import { Module } from "@nestjs/common";
import { AzureMessageBusModule } from "common";
import { config } from "../config";
import { CreditCardIssuerModule } from "bank/cc.issuer.module";

@Module({
  imports: [
    AzureMessageBusModule.register(config.SRVBUS_CONFIG),
    CreditCardIssuerModule,
  ],
  providers: [],
})
export class AppModule {}
