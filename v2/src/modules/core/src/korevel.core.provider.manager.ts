import { IKorevelLogger, KorevelLogger } from "../../logger/index.ts";
import {
  IKorevel,
  IKorevelCoreProviderManager,
  IKorevelCoreProviderRegistry,
  IKorevelProvider,
  KorevelCoreProviderRegistry,
} from "../index.ts";

export default class KorevelCoreProviderManager implements IKorevelCoreProviderManager {
  registry: IKorevelCoreProviderRegistry;
  logger: IKorevelLogger;

  constructor() {
    this.registry = new KorevelCoreProviderRegistry();
    this.logger = new KorevelLogger({ instance: this });
  }

  async boot(app: IKorevel): Promise<void> {
    this.logger.log("Booting providers");
    for (const provider of this.getProviders()) {
      await provider.boot(app);
    }
  }
  async register(app: IKorevel): Promise<void> {
    this.logger.log("Registering providers");
    for (const provider of this.getProviders()) {
      await provider.register(app);
    }
  }

  getProviders(): IKorevelProvider[] {
    return this.registry.getProviders();
  }

  registerProvider(provider: IKorevelProvider): void {
    this.registry.registerProvider(provider);
  }

  registerProviders(providers: IKorevelProvider[]): void {
    this.registry.registerProviders(providers);
  }
}
