import { IKorevelContainer } from "../../container/index.ts";
import { IKorevelEnvironment } from "../../environment/index.ts";
import {
  IKorevelLibrary,
  IKorevelLibraryDependency,
} from "../../library/index.ts";
import { IKorevelBuilderExtension } from "../../builder/index.ts";

export interface IKorevel extends IKorevelCore {}

export interface IKorevelCore extends IKorevelBuilderExtension<IKorevel> {
  start(): Promise<void>;
  boot(): Promise<void>;
  register(): Promise<void>;
  getConfig(): IKorevelCoreConfig;
  getLibrary(): IKorevelLibrary;
  getContainer(): IKorevelContainer;
  getProvider(): IKorevelCoreProviderManager;
  getEnvironment(): IKorevelEnvironment;
}

export interface IKorevelCoreBuilder {
  setDatabase(database: string): IKorevelCoreBuilder;
  setEnvironmentUrl(url: string): IKorevelCoreBuilder;
}

export interface IKorevelProvider {
  register(app: IKorevel): void | Promise<void>;
  boot(app: IKorevel): void | Promise<void>;
}

export interface IKorevelCoreProviderManager
  extends IKorevelProvider, IKorevelCoreProviderRegistry {}

export interface IKorevelCoreProviderRegistry {
  getProviders(): IKorevelProvider[];
  registerProvider(provider: IKorevelProvider): void;
  registerProviders(providers: IKorevelProvider[]): void;
}

export interface IKorevelCoreConfig {
  setSystemDependencies(dependencies: IKorevelLibraryDependency[]): void;
  getSystemDependencies(): IKorevelLibraryDependency[];
  registerProviders(providers: IKorevelProvider[]): void;
  getProviders(): IKorevelProvider[];
  loadLibraries(): Promise<void>;
}
