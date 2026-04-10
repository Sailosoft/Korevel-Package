import { KorevelArtisanProvider } from "../modules/artisan/index.ts";
import { KorevelCoreProvider } from "../modules/core/index.ts";
import {
  korevelDependencyAwilix,
  korevelDependencyDexie,
  korevelDependencyLodash,
  korevelDependencyMirage,
  korevelDependencyGun,
  korevelDependencyNedb,
} from "../modules/dependencies/index.ts";
import { KorevelHttpProvider } from "../modules/http/index.ts";
import { KorevelLoggerProvider } from '../modules/logger/src/korevel-logger.provider.ts';
import { KorevelRouterProvider } from "../modules/router/index.ts";
import { KorevelRunnableProvider } from "../modules/runnable/index.ts";
import { KorevelServerProvider } from "../modules/server/index.ts";
import { KorevelStorageProvider } from '../modules/storage/src/korevel-storage.provider.ts';
import { IKorevelConfiguration } from "./index.ts";
import { korevelConfigurationEnvironment } from "./korevel-configuration.environment.ts";

export const korevelConfiguration: IKorevelConfiguration = {
  dependency: {
    list: [
      korevelDependencyAwilix,
      korevelDependencyDexie,
      korevelDependencyLodash,
      korevelDependencyMirage,
      korevelDependencyGun,
      korevelDependencyNedb,
    ],
  },
  provider: {
    list: [
      new KorevelCoreProvider(),
      new KorevelRouterProvider(),
      new KorevelRunnableProvider(),
      new KorevelServerProvider(),
      new KorevelHttpProvider(),
      new KorevelArtisanProvider(),
      new KorevelLoggerProvider(),
      new KorevelStorageProvider()
    ],
  },
  environment: {
    list: korevelConfigurationEnvironment,
  },
};
