import {
  createKorevelLibraryVirtualModule,
  IKorevelLibraryDependency,
} from "../../library/index.ts";
import { IKorevelDepMirage } from "./mirage.def.ts";

export const korevelDependencyMirage: IKorevelLibraryDependency = {
  name: "mirage",
  cdn: "https://unpkg.com/miragejs/dist/mirage-umd.js",
  source: "MirageJS",
};

export const korevelMirage =
  createKorevelLibraryVirtualModule<IKorevelDepMirage>(korevelDependencyMirage);
