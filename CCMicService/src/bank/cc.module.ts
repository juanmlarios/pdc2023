import { Module, OnModuleInit } from "@nestjs/common";
import { config } from "../../config";
import { EventStoreModuleV2 } from "common";
import { CreditCardController } from "./cc.controller";
import { CreditCardService } from "./cc.service";
import { CCProcessingSrv, CCSubscriber } from "./process.cc.service";
import { CqrsModule } from "@nestjs/cqrs";
import {
  CreditCardProjtHandler,
  IssueCreditCardCommandHandler,
} from "./cc.handlers";

@Module({
  imports: [
    CqrsModule,
    EventStoreModuleV2.register(
      config.EVENT_STORE_SETTINGS_COSMOS,
      config.PROJECTION_STORE_SETTINGS_COSMOS
    ),
  ],
  controllers: [CreditCardController],
  providers: [
    CreditCardService,
    CCSubscriber,
    CCProcessingSrv,
    CreditCardProjtHandler,
    IssueCreditCardCommandHandler,
  ],
})
export class CreditCardModule implements OnModuleInit {
  onModuleInit() {}
}
