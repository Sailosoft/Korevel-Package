import { IKorevelEnvironmentProperty } from "../modules/environment/index.ts";
import { KorevelLogLevel } from '../modules/logger/index.ts';

export const korevelConfigurationEnvironment: IKorevelEnvironmentProperty[] = [
  {
    name: "DATABASE",
    type: "string",
    required: true,
    default: "default",
  },
  {
    name: "BASE_URL",
    type: "string",
    required: true,
    default: "http://localhost:3000",
  },
  {
    name: "LOG_LEVEL",
    type: "number",
    required: false,
    default: KorevelLogLevel.DEBUG,
  }
];
