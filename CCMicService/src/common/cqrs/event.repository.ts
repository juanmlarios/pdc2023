import { Inject, Injectable, Logger } from "@nestjs/common";
import { AggregateBase, Memento } from "../ddd/aggregate.base";
import { IEventStore } from "../interfaces/ieventstore";
import { plainToClass } from "class-transformer";
import { ConcurrencyError, AggregateNotFoundError } from "../exceptions";

@Injectable()
export class EventRepository<T extends AggregateBase> {
  constructor(
    @Inject("EVENTSTORE") private readonly _eventStore: IEventStore
  ) {}

  public async GetHistory(
    type: new (id: any, tenantId?: any) => T,
    id: string,
    timeStamp?: number,
    version?: number
  ): Promise<T> {
    const item: T = new type(id);
    const response = await this._eventStore.LoadHistoryStreamAsync(
      id,
      version,
      timeStamp
    );
    item.loadFromHistory(response.resources);
    return item;
  }

  public async Get(
    type: new (id: any, tenantId?: any) => T,
    id?: string,
    tenantId?: string
  ): Promise<T> {
    let item: T = new type(id, tenantId);
    if (id) {
      const version = item.getVersion();
      const response = await this._eventStore.LoadStreamAsync(id);
      item.loadFromHistory(response.resources);
    }
    return item;
  }

  public async Put(item: T): Promise<any> {
    try {
      const changes = item.getUncommittedEvents();
      let result: any;
      if (item.getVersion() === 0) {
        // new item
        result = this._eventStore.AppendToStream(
          item.getId(),
          item.getVersion(),
          changes
        );
      } else {
        const latest = await this._eventStore.GetLatestEventVersion(
          item.getId()
        );
        if (latest?.resources?.length) {
          const lastVersion = latest.resources.pop();
          if (item.getVersion() === lastVersion) {
            result = this._eventStore.AppendToStream(
              item.getId(),
              item.getVersion(),
              changes
            );
          } else {
            throw new ConcurrencyError("Concurrency Issues");
          }
        } else {
          throw new AggregateNotFoundError("Stream Not Found");
        }
      }
      return result;
    } catch (err) {
      Logger.error("Failed to put item in event repository");
      throw err;
    }
  }
}
