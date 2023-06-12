import {
  BulkOperationType,
  CosmosClient,
  UpsertOperationInput,
} from "@azure/cosmos";
import { Inject, Injectable } from "@nestjs/common";
import { IEvent } from "@nestjs/cqrs";
import { IEventStore, IProjectionStore } from "../interfaces/ieventstore";


/**
 * @class EventStore
 * @description reads and writes to a cosmos db database
 */

export interface ICosmosConfig {
  clientConfig: {
    endpoint: string;
    key: string;
  };
  eventDB: string;
  eventContainer: string;
  partitionKey: string;
  memento_configs?: {
    enabled: boolean;
    eventDB: string;
    eventContainer: string;
    ruThreshold: number;
    partitionKey: string;
  };
}

@Injectable()
export class EventCosmosStore implements IEventStore {
  private client: CosmosClient;

  constructor(@Inject("EVENTSTORE_CONFIG") private config: ICosmosConfig) {
    this.client = new CosmosClient(this.config.clientConfig);
  }

  async AppendToStream(
    streamId: string,
    expectedVersion: number,
    events: IEvent[]
  ): Promise<any> {
    let counter: number = expectedVersion;
    const upsertedBatch: UpsertOperationInput[] = [];
    const records: Array<any> = [];
    events.forEach((event) => {
      const entry = this.PrepareEvent(streamId, counter, event);
      upsertedBatch.push({
        operationType: BulkOperationType.Upsert,
        resourceBody: entry,
      });
      counter = entry.version;
    });

    return await this.client
      .database(this.config.eventDB)
      .container(this.config.eventContainer)
      .items.batch(upsertedBatch, streamId, {
        disableRUPerMinuteUsage: true,
      });
  }

  async GetLatestEventVersion(streamId: string): Promise<any> {
    const query = `SELECT TOP 1 VALUE c.version FROM c WHERE c.streamId = '${streamId}' ORDER BY c.version DESC`;
    const response = await this.client
      .database(this.config.eventDB)
      .container(this.config.eventContainer)
      .items.query(query)
      .fetchAll();
    return response;
  }
  async LoadStreamAsync(streamId: string): Promise<any> {
    // tslint:disable-next-line:max-line-length
    const query = `SELECT * FROM ${this.config.eventContainer} e WHERE e.streamId = '${streamId}' ORDER BY e.version`;

    const response = await this.client
      .database(this.config.eventDB)
      .container(this.config.eventContainer)
      .items.query(query)
      .fetchAll();
    return response;
  }

  async LoadHistoryStreamAsync(
    streamId: string,
    version?: number,
    timeStamp?: number
  ): Promise<any> {
    let timeQuery = "";
    if (timeStamp) {
      timeQuery += ` AND e.updatedTime <= ${timeStamp}`;
    }
    let versionQuery = "";
    if (version) {
      versionQuery += ` AND e.version <= ${version}`;
    }
    // tslint:disable-next-line:max-line-length
    const query = `SELECT * FROM ${this.config.eventContainer} e WHERE e.streamId = '${streamId}'${timeQuery}${versionQuery} ORDER BY e.version`;

    const response = await this.client
      .database(this.config.eventDB)
      .container(this.config.eventContainer)
      .items.query(query)
      .fetchAll();
    return response;
  }

  private PrepareEvent(
    streamId: string,
    expectedVersion: number,
    event: IEvent
  ): any {
    const jsonEvent = JSON.parse(JSON.stringify(event));
    const streamRes = {
      id: `${streamId}:${++expectedVersion}:${event.constructor.name}`,
      eventType: event.constructor.name,
      tenantId: jsonEvent.tenantId,
      updatedTime: Date.now(),
      streamId: `${streamId}`,
      version: expectedVersion,
      payload: {},
    };

    if (jsonEvent.payload) {
      streamRes.payload = jsonEvent.payload;
    } else {
      streamRes.payload = {};
    }

    return streamRes;
  }
}

@Injectable()
export class ProjectionCosmosStore implements IProjectionStore {
  private client: CosmosClient;

  constructor(@Inject("PROJECTIONSTORE_CONFIG") private config: ICosmosConfig) {
    this.client = new CosmosClient(this.config.clientConfig);
  }

  async QueryRecordAsync<T>(itemId: string) {
    const query = `SELECT * FROM ${this.config.eventContainer} e WHERE e.Id = '${itemId}' OFFSET 0 LIMIT 1`;
    const response = await this.client
      .database(this.config.eventDB)
      .container(this.config.eventContainer)
      .items.query(query)
      .fetchAll();
    return response;
  }

  async UpsertRecordsAsync(records: any[]) {
    const upsertedBatch: UpsertOperationInput[] = [];
    records.forEach((record) => {
      upsertedBatch.push({
        operationType: BulkOperationType.Upsert,
        resourceBody: record,
      });
    });

    return await this.client
      .database(this.config.eventDB)
      .container(this.config.eventContainer)
      .items.batch(upsertedBatch, records[0].tenantId, {
        disableRUPerMinuteUsage: true,
      });
  }
}
