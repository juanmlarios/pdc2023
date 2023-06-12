import { Global, Module } from "@nestjs/common";
import {
  AzureMessageBus,
  AzureServiceBusConfig,
} from "../models/azure.messagebus";

@Global()
@Module({})
export class AzureMessageBusModule {
  static register(sbconfig: AzureServiceBusConfig) {
    return {
      module: AzureMessageBusModule,
      imports: [],
      isglobal: true,
      providers: [
        AzureMessageBus,
        {
          provide: "AZURESBUS_CONFIG",
          useValue: sbconfig,
        },
      ],
      exports: [AzureMessageBus],
    };
  }
}
