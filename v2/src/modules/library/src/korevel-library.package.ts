import {
  IKorevelLibraryPackage,
  IKorevelLibraryPackageList,
  IKorevelLibraryStore,
} from "../index.ts";

export default class KorevelLibraryPackage<
  K extends IKorevelLibraryPackageList,
> implements IKorevelLibraryPackage<K> {
  store: IKorevelLibraryStore;
  global: any = globalThis;
  packages = new Map<keyof K, any>();

  constructor(store: IKorevelLibraryStore) {
    this.store = store;
  }

  load(): void {
    const deps = this.store.getAll();
    deps.forEach((e) => {
      // 1. Check "e" (the item), not "dep" (the array)
      if ("source" in e) {
        // 2. Cast e.name as keyof IKorevelLibraryPackageList to satisfy the Map
        const packageName = e.name as keyof K;

        // 3. Access the global object using the source string
        this.packages.set(packageName, this.global[e.source]);
      }
    });
  }

  get<N extends keyof K>(name: N): K[N] {
    return this.packages.get(name);
  }
}
