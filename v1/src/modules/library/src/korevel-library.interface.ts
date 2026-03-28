import { IKorevelDepDexie } from "../../dependencies/dexie/dexie.def.ts";
import {
  IKorevelDepAwilix,
  IKorevelDepMirage,
} from "../../dependencies/index.ts";

export interface IKorevelLibraryPackageList {
  awilix: IKorevelDepAwilix;
  mirage: IKorevelDepMirage;
  dexie: IKorevelDepDexie;
}

export interface IKorevelLibrary extends IKorevelLibraryPackageList {
  storeDependencies(dependencies: IKorevelLibraryDependency[]): void;
  loadDependencies(): Promise<void>;
  // loadDependencies(d: IKorevelLibraryDependency[]): Promise<void>;
}

export type IKorevelLibraryMap = Map<string, IKorevelLibraryDependency>;

export interface IKorevelLibraryStore {
  store(dependency: IKorevelLibraryDependency): void;
  stores(dependencies: IKorevelLibraryDependency[]): void;
  // storeMap(name: string, lib: string, map: (obj: any) => any): void;
  // get<K extends keyof IKorevelStoreLibrary>(name: K): IKorevelStoreLibrary[K];
  getAll(): IKorevelLibraryDependency[];
}

export type IKorevelLibraryDependency = {
  name: string;
  cdn: string;
  source: string;

  map?: (obj: any) => any;
};
export interface IKorevelLibraryLoader {
  load(): Promise<void>;
}

export interface IKoreveLibraryLoaderScript {
  /**
   * Creates a script element with the specified source.
   * @param source The URL of the script to load.
   */
  createScriptElementVia(source: string): HTMLScriptElement;

  /**
   * Appends the script element to the document head and returns a promise
   * that resolves when the script has finished loading.
   * @param scriptElement The HTMLScriptElement to attach.
   */
  attachScriptElementToDocument(
    scriptElement: HTMLScriptElement,
  ): Promise<HTMLScriptElement>;

  /**
   * Orchestrates the creation and attachment of a script.
   * @param src The URL of the script to load.
   */
  loadScript(src: string): Promise<void>;
}

export interface IKorevelLibraryPackage<
  TList extends IKorevelLibraryPackageList,
> {
  load(): void;
  get<K extends keyof TList>(name: K): TList[K];
}
