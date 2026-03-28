import { VortexDBException } from "./index.ts";

export class VortexDBConfig {
  private _database?: string;

  baseName: string = "vortexdb";
  get database() {
    if (!this._database) {
      throw VortexDBException.databaseNameRequired();
    }
    return this._database;
  }

  set database(value: string) {
    this._database = value;
  }
}
