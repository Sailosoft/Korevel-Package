import { IKorevelLogger, KorevelLogger } from "../../logger/index.ts";
import {
  IKorevelLibraryDependency,
  IKorevelLibraryMap,
  IKorevelLibraryStore,
} from "../index.ts";

export default class KorevelLibraryStore implements IKorevelLibraryStore {
  dependencies: IKorevelLibraryMap = new Map<
    string,
    IKorevelLibraryDependency
  >();
  global: any = globalThis;
  logger: IKorevelLogger;

  constructor() {
    this.logger = new KorevelLogger({ instance: this });
  }

  store(dependency: IKorevelLibraryDependency): void {
    this.dependencies.set(dependency.name, dependency);
  }

  stores(dependencies: IKorevelLibraryDependency[]): void {
    dependencies.forEach((dependency) => {
      this.store(dependency);
    });
  }

  getAll(): IKorevelLibraryDependency[] {
    return this.dependencies.values().toArray();
  }
}
