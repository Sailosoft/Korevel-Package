import {
  createKorevelLibraryVirtualDynamicModule,
  IKorevelLibraryDependency,
} from "../../library/index.ts";
import { IKorevelDepNedb } from "./korevel-dependency.nedb.ts";

/**
 * NeDB Dependency Configuration
 * <!-- Option A – most maintained fork right now -->
 * <script src="https://cdn.jsdelivr.net/npm/@seald-io/nedb-browser@4.0.3"></script>
 * <!-- Option B – classic / very compatible -->
 * <script src="https://cdn.jsdelivr.net/npm/nedb-browserified@0.15.0"></script>
 * <!-- Option C – another maintained fork -->
 * <script src="https://unpkg.com/nedb-browser@2.1.0"></script>
 */
export const korevelDependencyNedb: IKorevelLibraryDependency = {
  name: "nedb",
  // Note: NeDB is primarily a Node.js lib; for browser use,
  // a common bundle like 'nedb-browser' or a CDN version is used.
  cdn: "https://cdn.jsdelivr.net/npm/@seald-io/nedb@4.0.2/browser-version/out/nedb.js",
  // cdn: "https://cdnjs.cloudflare.com/ajax/libs/nedb/1.8.0/nedb.min.js",
  source: "Nedb",
};

export const korevelNedb =
  createKorevelLibraryVirtualDynamicModule<IKorevelDepNedb>(
    korevelDependencyNedb,
  );
