import { IKorevelProvider } from "../modules/core/index.ts";
import { IKorevelEnvironmentProperty } from "../modules/environment/index.ts";
import { IKorevelLibraryDependency } from "../modules/library/index.ts";

export interface IKorevelConfigurationDependency {
  list: IKorevelLibraryDependency[];
}

export interface IKorevelConfigurationProvider {
  list: IKorevelProvider[];
}

interface IKorevelConfigurationEnvironment {
  list: IKorevelEnvironmentProperty[];
}

export interface IKorevelConfiguration {
  dependency: IKorevelConfigurationDependency;
  provider: IKorevelConfigurationProvider;
  environment: IKorevelConfigurationEnvironment;
}
