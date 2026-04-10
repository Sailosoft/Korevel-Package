import { IKorevelLogger, KorevelLogger } from "../../logger/index.ts";
import {
  IKorevelLibraryStore,
  IKoreveLibraryLoaderScript,
  KorevelLibraryLoaderScript,
  IKorevelLibraryLoader,
} from "../index.ts";

export default class KorevelLibraryLoader implements IKorevelLibraryLoader {
  store: IKorevelLibraryStore;
  logger: IKorevelLogger;
  loader: IKoreveLibraryLoaderScript;

  constructor(store: IKorevelLibraryStore) {
    this.store = store;
    this.logger = new KorevelLogger({
      instance: this,
    });

    this.loader = new KorevelLibraryLoaderScript();
  }

  async load(): Promise<void> {
    const dependencies = this.store.getAll();

    for (const e of dependencies) {
      this.logger.log(`Installing dependency ${e.name} with ${e.cdn}`);
      await this.loader.loadScript(e.cdn);
    }
  }
}
