import {
  IKorevelLibraryDependency,
  createKorevelLibraryVirtualDynamicModule,
} from "../../library/index.ts";
import { IKorevelDepGunConstructor } from "./gun.def.ts";

export const korevelDependencyGun: IKorevelLibraryDependency = {
  name: "gun",
  cdn: "https://cdn.jsdelivr.net/npm/gun/gun.js",
  source: "Gun", // Matches the global 'Gun' variable from the CDN
};

export const korevelGun =
  createKorevelLibraryVirtualDynamicModule<IKorevelDepGunConstructor>(
    korevelDependencyGun,
  );
