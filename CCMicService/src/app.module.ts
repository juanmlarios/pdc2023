import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { CreditCardModule } from "bank/cc.module";
import { AzureMessageBusModule } from "common/servicebus";
import { config } from "../config";

@Module({
  imports: [
    AzureMessageBusModule.register(config.SRVBUS_CONFIG),
    CreditCardModule,
  ],
  providers: [],
})
export class AppModule {}
