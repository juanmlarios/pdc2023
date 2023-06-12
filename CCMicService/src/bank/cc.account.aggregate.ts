import { AggregateBase, Utility } from "common";
import { AggResponse, Limits, Transaction } from "./models";
import {
  CreditCardActivated,
  CreditCardInitiated,
  TransactionCreated,
} from "./cc.account.events";

enum CreditCardStatus {
  Active = "active",
  Inactive = "inactive",
  Suspended = "suspended",
}

export class CreditCardAgg extends AggregateBase {
  private _transactions: Record<string, Transaction> = {};
  private _status: CreditCardStatus = CreditCardStatus.Inactive;

  /// balance
  private _limit: number = 0;
  private _intRate: number = 0;
  private _availableBalance: number = 0;

  constructor(accId: string, tenantId?: string) {
    super(accId, tenantId);
    // this.init();
  }

  public init(limit: Limits): AggResponse {
    this.apply(new CreditCardInitiated(this.getEventParams(limit)), false);
    return { success: true, message: "Credit card Issues and Initialized" };
  }

  public activate(): AggResponse {
    if (this._status === CreditCardStatus.Active) {
      return { success: false, message: "Credit card already activated" };
    }

    this.apply(new CreditCardActivated(this.getEventParams()), false);
    return { success: true, message: "Credit card activated" };
  }

  public disable(): AggResponse {
    if (this._status === CreditCardStatus.Inactive) {
      return { success: false, message: "Credit card already inactive" };
    }

    this.apply(new CreditCardActivated(this.getEventParams()), false);
    return { success: true, message: "Credit card activated" };
  }

  public transaction(transaction: Transaction): AggResponse {
    let result: AggResponse = new AggResponse(
      "Transaction could not be posted",
      false
    );
    if (this._status === CreditCardStatus.Active) {
      if (this._availableBalance >= transaction.amount) {
        this.apply(
          new TransactionCreated(this.getEventParams(transaction)),
          false
        );
        result = new AggResponse("Transaction will be posted", true);
      }
    }
    return result;
  }

  public getProjection(): any {
    return {
      id: this.getId(),
      tenantId: this.getTenantId(),
      status: this._status,
      availableBalance: this._availableBalance,
      limit: this._limit,
      transactions: Utility.recordToArray(this._transactions),
    };
  }

  protected applyState(event: any): void {
    const eventType =
      event.eventType !== undefined ? event.eventType : event.constructor.name;
    this.setVersion(event.version);

    switch (eventType) {
      case "CreditCardInitiated": {
        this._status = CreditCardStatus.Active;
        this._limit = (event.payload as Limits).limit;
        this._availableBalance = this._limit;
        this._intRate = (event.payload as Limits).interstRate;
        break;
      }
      case "CreditCardActivated": {
        this._status = CreditCardStatus.Active;
        break;
      }
      case "CreditCardDisabled": {
        this._status = CreditCardStatus.Inactive;
        break;
      }
      case "TransactionCreated": {
        this._transactions[(event.payload as Transaction).id] =
          event.payload as Transaction;
        this._availableBalance -= (event.payload as Transaction).amount;
        if (this._availableBalance <= 0) {
          this._status = CreditCardStatus.Suspended;
        }
        break;
      }
      default: {
        break;
      }
    }
  }
}
