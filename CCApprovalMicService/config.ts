// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

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
