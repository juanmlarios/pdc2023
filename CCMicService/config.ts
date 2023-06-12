// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();
import { ICosmosConfig } from "common";
import { CONSTANTS } from "./constants";

/****************** NEST JS CONFIGS *******************/
const nestConfigs = {
  NAME: "Bank",
  DESC: "Demo for Bank Purposes",
  ENV: process.env.NODE_ENV,
  PORT: "7070",
  SRVHOST: "0.0.0.0",
};
/******************************************************/

/****************** EVENT STORE CONFIGS *******************/
const eventStoreConfigs = {
  EVENT_STORE_SETTINGS_COSMOS: {
    clientConfig: {
      endpoint: process.env.COSMOSDB_EVENT_ENDPOINT,
      key: process.env.COSMOSDB_EVENT_KEY,
    },
    eventDB: process.env.EVENTDB,
    eventContainer: process.env.EVENTCONTAINER,
    partitionKey: CONSTANTS.COSMOS_EVENT_PARTITION_KEY,
    memento_configs: {
      enabled: !!+(process.env.MEMENTOSENABLED || "false"),
      eventDB: process.env.MEMENTOSDB,
      eventContainer: process.env.MEMENTOSCONTAINER,
      ruThreshold:
        process.env.RUTHRESHOLD && !isNaN(+process.env.RUTHRESHOLD)
          ? +process.env.RUTHRESHOLD
          : 20,
      partitionKey: CONSTANTS.COSMOS_MEMENTO_PARTITION_KEY,
    },
  } as ICosmosConfig,
  PROJECTION_STORE_SETTINGS_COSMOS: {
    clientConfig: {
      endpoint: process.env.COSMOSDB_PROJ_ENDPOINT,
      key: process.env.COSMOSDB_PROJ_KEY,
    },
    eventDB: process.env.PROJECTIONDB,
    eventContainer: process.env.PROJECTIONCONTAINER,
    partitionKey: CONSTANTS.COSMOS_PROJECTION_PARTITION_KEY,
  } as ICosmosConfig,
  SRVBUS_CONFIG: {
    key: process.env.SERVICEBUS_CONNECTION_STRING,
  },
};
/**********************************************************/

/********************************************************/

const config = {
  ...nestConfigs,
  ...eventStoreConfigs,
};

export { config };
