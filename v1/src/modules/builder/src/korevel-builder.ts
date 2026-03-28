import {
  IKorevelCoreConfig,
  IKorevelCoreProviderManager,
  IKorevelProvider,
} from "../../core/index.ts";
import { IKorevelEnvironment } from "../../environment/index.ts";
import { KorevelEnvironmentProperty } from "../../environment/src/korevel-environment.enum.ts";
import { IKorevelBuilder } from "../index.ts";

export class KorevelBuilder implements IKorevelBuilder {
  constructor(
    private environment: IKorevelEnvironment,
    private config: IKorevelCoreConfig,
  ) {}

  setDatabase(database: string): IKorevelBuilder {
    this.environment.set(KorevelEnvironmentProperty.DATABASE, database);
    return this;
  }
  setProviders(providers: IKorevelProvider[]): IKorevelBuilder {
    this.config.registerProviders(providers);
    return this;
  }
  setBaseUrl(url: string): IKorevelBuilder {
    this.environment.set(KorevelEnvironmentProperty.BASE_URL, url);
    return this;
  }
}
