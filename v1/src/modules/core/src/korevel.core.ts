import {
  IKorevelBuilder,
  IKorevelBuilderFn,
  KorevelBuilder,
} from "../../builder/index.ts";
import { IKorevelContainer, KorevelContainer } from "../../container/index.ts";
import {
  IKorevelEnvironment,
  KorevelEnvironment,
} from "../../environment/index.ts";
import { IKorevelLibrary, KorevelLibrary } from "../../library/index.ts";
import { IKorevelLogger, KorevelLogger } from "../../logger/index.ts";
import { IKorevelRunnable } from "../../runnable/index.ts";

import {
  IKorevel,
  IKorevelCoreConfig,
  IKorevelCoreProviderManager,
  KorevelCoreException,
  KorevelCoreProviderManager,
} from "../index.ts";
import KorevelCoreConfig from "./korevel.core.config.ts";

export default class KorevelCore implements IKorevel {
  logger: IKorevelLogger;
  environment: IKorevelEnvironment;
  library: IKorevelLibrary;
  config: IKorevelCoreConfig;
  container?: IKorevelContainer;
  builder: IKorevelBuilder;

  // provider
  provider: IKorevelCoreProviderManager;

  constructor() {
    this.logger = new KorevelLogger({ instance: this });
    this.environment = new KorevelEnvironment();
    this.library = new KorevelLibrary();
    this.config = new KorevelCoreConfig(this.library);

    // Registry
    this.provider = new KorevelCoreProviderManager();

    // Core Builder
    this.builder = new KorevelBuilder(this.environment, this.config);
  }

  async start(): Promise<void> {
    await this.register();
    await this.boot();
    await this.getContainer().resolve<IKorevelRunnable>("runnable").run();
  }

  async register() {
    this.logger.log("Registering Korevel Core...");
    // Load libraries
    await this.config.loadLibraries();
    // Register providers
    this.provider.registerProviders(this.config.getProviders());

    this.logger.log("Korevel Core Registered");
  }

  async boot() {
    this.logger.log("Booting Korevel Core...");
    // Create container
    this.container = new KorevelContainer(this.library);

    // Bootstrapping providers
    this.logger.log("Bootstrapping providers: ", this.provider.getProviders());

    // Register providers
    await this.provider.register(this);
    // Boot providers
    await this.provider.boot(this);
    this.logger.log("Korevel Core Booted");
  }

  getLibrary(): IKorevelLibrary {
    return this.library;
  }

  getContainer(): IKorevelContainer {
    if (!this.container) {
      throw KorevelCoreException.createContainerException();
    }
    return this.container;
  }

  getConfig(): IKorevelCoreConfig {
    return this.config;
  }

  getProvider(): IKorevelCoreProviderManager {
    return this.provider;
  }

  getEnvironment(): IKorevelEnvironment {
    return this.environment;
  }

  build(builder: IKorevelBuilderFn): IKorevel {
    builder(this.builder);
    return this;
  }
}
