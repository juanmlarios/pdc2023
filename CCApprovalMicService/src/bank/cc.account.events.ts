import { BaseEvent, BaseEventParams, ExtendedEventParams } from "common";

export class CreditCardIssued extends BaseEvent<ExtendedEventParams> {
  constructor(params: ExtendedEventParams) {
    super(params);
  }
}
