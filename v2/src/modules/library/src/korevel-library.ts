import {
  IKorevelLibrary,
  IKorevelLibraryLoader,
  IKorevelLibraryPackage,
  IKorevelLibraryPackageList,
  IKorevelLibraryStore,
  KorevelLibraryPackage,
  KorevelLibraryStore,
  KorevelLibraryLoader,
  IKorevelLibraryDependency,
} from "../index.ts";

export default class KorevelLibrary implements IKorevelLibrary {
  store: IKorevelLibraryStore;
  loader: IKorevelLibraryLoader;
  package: IKorevelLibraryPackage<IKorevelLibraryPackageList>;

  constructor() {
    this.store = new KorevelLibraryStore();
    this.loader = new KorevelLibraryLoader(this.store);
    this.package = new KorevelLibraryPackage(this.store);
  }

  storeDependencies(dependencies: IKorevelLibraryDependency[]): void {
    this.store.stores(dependencies);
  }

  /**
   * This will load and create scripts into globalthis
   * Then load it to Korevel Core
   */
  async loadDependencies(): Promise<void> {
    await this.loader.load();
    this.package.load();
  }

  /**
   * Important to load dependecy from global this
   * Access Korevel Library via global this
   */
  // async loadDependencies(d: IKorevelLibraryDependency[]) {
  //   this.store.stores(d);
  //   await this.loader.load();
  //   this.package.load();
  // }

  get awilix() {
    return this.package.get("awilix");
  }

  get mirage() {
    return this.package.get("mirage");
  }

  get dexie() {
    return this.package.get("dexie");
  }
}
