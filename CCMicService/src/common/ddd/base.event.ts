import { IEvent } from '@nestjs/cqrs';

export class BaseEventParams {
  public id: string;
  public tenantId: string;
  public version: number;
}

export class ExtendedEventParams extends BaseEventParams {
  public payload?: any;
}

// tslint:disable-next-line:no-shadowed-variable
export class BaseEvent<P extends ExtendedEventParams> implements IEvent {
  public readonly id: string;
  public readonly tenantId: string;
  public readonly version: number;
  public readonly createdby: string; // the originator of the event
  public readonly payload: any = {};
  public readonly eventType: string = this.constructor.name;

  public appCreatedBy: string;

  constructor(params: P, createdby?: string) {
    if (params) {
      this.id = params.id;
      this.version = params.version;
      this.tenantId = params.tenantId;
      this.createdby = createdby ? createdby : params.id;
      if (params.payload) this.payload = params.payload;
    }
  }
}
