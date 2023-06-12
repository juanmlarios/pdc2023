import { DynamicModule, Logger, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { EventRepository } from "../cqrs/event.repository";
import { QueryRepository } from "../cqrs/query.repository";
import { Service } from "../cqrs/service";
import {
  EventCosmosStore,
  ICosmosConfig,
  ProjectionCosmosStore,
} from "./event-store.cosmos";

@Module({})
export class EventStoreModuleV2 {
  static register(
    eventConfig: ICosmosConfig,
    projectionConfig: ICosmosConfig
  ): DynamicModule {
    return {
      module: EventStoreModuleV2,
      imports: [EventEmitterModule.forRoot(), CqrsModule],
      providers: [
        {
          provide: "EVENTSTORE_CONFIG",
          useValue: eventConfig,
        },
        {
          provide: "PROJECTIONSTORE_CONFIG",
          useValue: projectionConfig,
        },
        {
          provide: "EVENTSTORE",
          useClass: EventCosmosStore,
        },
        {
          provide: "PROJECTIONSTORE",
          useClass: ProjectionCosmosStore,
        },
        Service,
        EventRepository,
        QueryRepository,
        Logger,
      ],
      exports: [Service, QueryRepository],
    };
  }
}
