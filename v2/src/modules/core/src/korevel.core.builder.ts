import { IKorevelEnvironment } from "../../environment/index.ts";
import { KorevelEnvironmentProperty } from "../../environment/src/korevel-environment.enum.ts";
import { IKorevelLogger, KorevelLogger } from "../../logger/index.ts";
import { IKorevelCoreBuilder } from "../index.ts";

export default class KorevelCoreBuilder implements IKorevelCoreBuilder {
  private environment: IKorevelEnvironment;
  logger: IKorevelLogger;

  constructor(environment: IKorevelEnvironment) {
    this.environment = environment;
    this.logger = new KorevelLogger({ instance: this });

    this.environment.registerEnvironment({
      name: KorevelEnvironmentProperty.DATABASE,
      type: "string",
      required: true,
    });

    this.environment.registerEnvironment({
      name: KorevelEnvironmentProperty.BASE_URL,
      type: "string",
      required: true,
    });
  }

  setDatabase(database: string): IKorevelCoreBuilder {
    this.logger.log(`Setting database to ${database}`);
    this.environment.set(KorevelEnvironmentProperty.DATABASE, database);
    return this;
  }

  setEnvironmentUrl(url: string): IKorevelCoreBuilder {
    this.logger.log(`Setting environment url to ${url}`);
    this.environment.set(KorevelEnvironmentProperty.BASE_URL, url);
    return this;
  }
}
