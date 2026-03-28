import { korevelConfiguration } from "./configurations/index.ts";
import { IKorevel, KorevelCore } from "./modules/core/index.ts";
import { IKorevelRunnable } from "./modules/runnable/index.ts";

export default class Korevel extends KorevelCore implements IKorevel {
  constructor() {
    super();
    this.getConfig().setSystemDependencies(
      korevelConfiguration.dependency.list,
    );
    this.getEnvironment().registerEnvironments(
      korevelConfiguration.environment.list,
    );
    this.getConfig().registerProviders(korevelConfiguration.provider.list);
  }
}
