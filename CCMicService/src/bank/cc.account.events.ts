import { BaseEvent, BaseEventParams } from "common";

export class CreditCardInitiated extends BaseEvent<BaseEventParams> {
  constructor(params: BaseEventParams) {
    super(params);
  }
}
export class CreditCardActivated extends BaseEvent<BaseEventParams> {
  constructor(params: BaseEventParams) {
    super(params);
  }
}

export class CreditCardDisabled extends BaseEvent<BaseEventParams> {
  constructor(params: BaseEventParams) {
    super(params);
  }
}

export class TransactionCreated extends BaseEvent<BaseEventParams> {
  constructor(params: BaseEventParams) {
    super(params);
  }
}

// export class PurchasedItem extends BaseEvent<BaseEventParams> {
//   constructor(params: BaseEventParams) {
//     super(params);
//   }
// }
