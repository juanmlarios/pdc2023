import { Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { IProcessable } from "../common/servicebus/models/interfaces";
import { AzureMessageBus } from "common/servicebus/models/azure.messagebus";
import { InitCreditCardCommand } from "./cc.handlers";

const RelaventEvents = {
  CreditCardIssued: "CreditCardIssued",
};

@Injectable()
export class CCProcessingSrv implements IProcessable {
  constructor(private readonly commandBus: CommandBus) {}

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  async process(message: any) {
    const eventType = message.body?.eventType;
    if (Object.values(RelaventEvents).includes(eventType)) {
      switch (eventType) {
        case RelaventEvents.CreditCardIssued:
          await this.commandBus.execute(
            new InitCreditCardCommand(
              message.body.id,
              message.body.tenantId,
              message.body.payload
            )
          );
          break;
        default: {
          break;
        }
      }
    }
  }
}

@Injectable()
export class CCSubscriber {
  constructor(
    private readonly azBus: AzureMessageBus,
    private readonly ccProcessingSrv: CCProcessingSrv
  ) {
    this.azBus.subscribeToTopic(
      "creditcardevents",
      "ccmicroservice",
      this.ccProcessingSrv
    );
  }
}
