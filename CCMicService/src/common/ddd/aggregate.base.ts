import { AggregateRoot, IEvent } from "@nestjs/cqrs";
import { Guid } from "guid-typescript";
import { ExtendedEventParams } from "./base.event";

export class Memento {
  public updateTime: number = Date.now();

  constructor(
    public id: string,
    private tenantId: string,
    public payload: any
  ) {}
}

export abstract class AggregateBase extends AggregateRoot {
  private _changes: IEvent[] = [];

  constructor(
    private _id?: string | undefined,
    private _tenantId: string = Guid.EMPTY,
    private _version: number = 0
  ) {
    super();
  }

  public loadFromHistory(history: any) {
    if (history.length > 0) {
      this._id = history[0].streamId;
      this._tenantId = history[0].tenantId;
      this._changes = [];
      this._version = 0;
      history.forEach((event) => {
        this.apply(event, true);
      });
    }
  }

  public getUncommittedEvents() {
    return this._changes;
  }

  protected clearChanges() {
    this._changes = [];
  }

  public apply(event: IEvent, isfromHistory: boolean) {
    this.applyState(event);
    if (!isfromHistory) {
      this._changes.push(event);
    }
  }

  public getId() {
    return this._id;
  }

  public getTenantId() {
    return this._tenantId;
  }

  public getVersion() {
    return this._version;
  }

  public setVersion(version: number) {
    this._version = version;
  }

  public getMemento(): Memento {
    return new Memento(
      this.constructor.name + "-" + this._id,
      this._tenantId,
      this
    );
  }

  public getEventParams(pay?: any): ExtendedEventParams {
    if (!pay) {
      pay = {};
    }
    return {
      id: this._id,
      tenantId: this._tenantId,
      version: this._version,
      payload: pay,
    };
  }

  protected abstract applyState(event: any): void;
}
