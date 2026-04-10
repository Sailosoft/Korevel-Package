import {
  createKorevelLibraryVirtualModule,
  IKorevelLibraryDependency,
} from "../../library/index.ts";
import { IKorevelDepLodash } from "./lodash.def.ts";

export const korevelDependencyLodash: IKorevelLibraryDependency = {
  name: "_",
  cdn: "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js",
  source: "_",
};

export const korevelLodash =
  createKorevelLibraryVirtualModule<IKorevelDepLodash>(korevelDependencyLodash);
