import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { EventRepository } from './event.repository';
import { AggregateBase } from '../ddd/aggregate.base';

@Injectable()
export class Service<T extends AggregateBase> {
  constructor(private readonly _eventBus: EventBus, private _repo: EventRepository<T>) {
  }
  
  public async Save(record: T): Promise<boolean> {
    let success = false;
    let result: any = {};
    try {
      result = await this._repo.Put(record);
      if (result === undefined || result === void 0) {
        Logger.error('Failed to Save. Reason: Unknown', { record: record });
      } else {
        if (result.code === 200) {
          const events = record.getUncommittedEvents();
          this._eventBus.publishAll(events);
          success = true;
        } else {
          Logger.error('Failed to Save. Reason: {reason}', { record: record, reason: result.error });
        }
      }
    } catch (e) {
      Logger.error('Failed to Save: {record} Reason: {reason} StackTrace: {stacktrace}', {
        record: record,
        reason: e.message,
        stacktrace: e.stackTrace
      });
      throw e;
    }
    return success;
  }

  public GetHistory(
    type: new (id: any, tenantId?: any) => T,
    id: string,
    timeStamp?: number,
    version?: number
  ): Promise<T> {
    return this._repo.GetHistory(type, id, timeStamp, version);
  }

  public Get(type: new (id: any, tenantId?: any) => T, id: string, tenantId?: string): Promise<T> {
    return this._repo.Get(type, id, tenantId);
  }
}
