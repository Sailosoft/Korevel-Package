import {
  createKorevelLibraryVirtualDynamicModule,
  IKorevelLibraryDependency,
} from "../../library/index.ts";
import { IKorevelDepDexie } from "./dexie.def.ts";

export const korevelDependencyDexie: IKorevelLibraryDependency = {
  name: "dexie",
  cdn: "https://unpkg.com/dexie@3.2.4/dist/dexie.js",
  source: "Dexie",
};

export const korevelDexie =
  createKorevelLibraryVirtualDynamicModule<IKorevelDepDexie>(
    korevelDependencyDexie,
  );
