import { IEvent } from "@nestjs/cqrs";

export interface IEventStore {
  AppendToStream(streamId: string, expectedVersion: number, events: IEvent[]);
  GetLatestEventVersion(streamId: string);
  LoadStreamAsync(streamId: string);
  LoadHistoryStreamAsync(
    streamId: string,
    version?: number,
    timeStamp?: number
  );
}

export interface IMementoStore {
  mementosEnabled: boolean;
  Fetch(id: string);
  Place(momento: any);
  getRUThreshold(): number;
}

export interface IProjectionStore {
  QueryRecordAsync<T>(itemId: string);
  UpsertRecordsAsync(records: any[]);
}
