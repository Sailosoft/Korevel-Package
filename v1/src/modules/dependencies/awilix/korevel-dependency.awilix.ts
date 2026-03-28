import { IKorevelLibraryDependency } from "../../library/index.ts";
import { createKorevelLibraryVirtualModule } from "../../library/index.ts";
import { IKorevelDepAwilix } from "../index.ts";

export const korevelDependencyAwilix: IKorevelLibraryDependency = {
  name: "awilix",
  cdn: "https://unpkg.com/awilix@12.0.5/lib/awilix.umd.js",
  source: "Awilix",
};

export const korevelAwilix =
  createKorevelLibraryVirtualModule<IKorevelDepAwilix>(korevelDependencyAwilix);
