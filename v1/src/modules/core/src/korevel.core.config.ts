import { KorevelContainer } from "../../container/index.ts";
import {
  IKorevelLibrary,
  IKorevelLibraryDependency,
} from "../../library/index.ts";
import { IKorevelLogger, KorevelLogger } from "../../logger/index.ts";
import { IKorevelCoreConfig, IKorevelProvider } from "../index.ts";

export default class KorevelCoreConfig implements IKorevelCoreConfig {
  logger: IKorevelLogger = new KorevelLogger({ instance: this });

  private _dependencies: IKorevelLibraryDependency[] = [];
  private _providers: IKorevelProvider[] = [];

  constructor(public library: IKorevelLibrary) {}
  registerProviders(providers: IKorevelProvider[]): void {
    this.logger.log("Registering Providers...");
    this._providers.push(...providers);
  }

  getProviders(): IKorevelProvider[] {
    this.logger.log("Getting Providers...");
    return this._providers;
  }

  getSystemDependencies() {
    this.logger.log("Getting System Dependencies...");
    return this._dependencies;
  }

  async loadLibraries(): Promise<void> {
    this.logger.log("Loading Korevel Libraries...");
    this.library.storeDependencies(this.getSystemDependencies());
    await this.library.loadDependencies();
  }

  setSystemDependencies(dependencies: IKorevelLibraryDependency[]): void {
    this.logger.log("Setting System Dependencies...");
    this._dependencies = dependencies;
  }
}
