import {
  CommandHandler,
  EventsHandler,
  ICommand,
  ICommandHandler,
  IEvent,
  IEventHandler,
} from "@nestjs/cqrs";
import { QueryRepository, Service } from "common";
import { CreditCardAgg } from "./cc.account.aggregate";
import { AggResponse, Limits } from "./models";
import {
  CreditCardActivated,
  CreditCardDisabled,
  CreditCardInitiated,
  TransactionCreated,
} from "./cc.account.events";

/// COMMAND and COMMAND HANDLER

export class InitCreditCardCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly limits: Limits
  ) {}
}

@CommandHandler(InitCreditCardCommand)
export class IssueCreditCardCommandHandler
  implements ICommandHandler<InitCreditCardCommand>
{
  constructor(private readonly _service: Service<CreditCardAgg>) {}

  async execute(command: InitCreditCardCommand) {
    const { tenantId, id, limits } = command;
    const ccCard = await this._service.Get(CreditCardAgg, id, tenantId);

    let result = { message: "CC not initiated", success: false } as AggResponse;
    if (ccCard.getVersion() === 0) {
      result = ccCard.init(limits);
    }
    if (result.success) this._service.Save(ccCard);
    return result;
  }
}

/// EVENT HANDLER

@EventsHandler(
  CreditCardInitiated,
  CreditCardActivated,
  CreditCardDisabled,
  TransactionCreated
)
export class CreditCardProjtHandler implements IEventHandler<IEvent> {
  constructor(
    private readonly _queryRepo: QueryRepository,
    private readonly _service: Service<CreditCardAgg>
  ) {}

  async handle(event: any) {
    const cCard: CreditCardAgg = await this._service.Get(
      CreditCardAgg,
      event.id
    );
    this._queryRepo.Write(cCard.getProjection());
  }
}
