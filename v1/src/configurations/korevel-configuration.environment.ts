import { IKorevelEnvironmentProperty } from "../modules/environment/index.ts";

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
];
