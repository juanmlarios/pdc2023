import { Inject, Injectable, Logger } from "@nestjs/common";
import { IProjectionStore } from "../interfaces/ieventstore";

@Injectable()
export class QueryRepository {
  constructor(
    @Inject('PROJECTIONSTORE') private _projectionStore: IProjectionStore
  ) { }

  public async Query<T>(itemId: string): Promise<Array<T>> {
    const result = await this._projectionStore.QueryRecordAsync<T>(itemId);
    return result.resources as Array<T>;
  }

  public async Write(projection: any) {
    try {
      await this._projectionStore.UpsertRecordsAsync([projection]);
    } catch (err) {
      Logger.error("Could not write to database: {reason}", {
        reason: err.message,
        exception: err,
      });
    }
  }
}
