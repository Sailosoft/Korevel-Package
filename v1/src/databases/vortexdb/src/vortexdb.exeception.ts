import { KorevelException } from "../../../modules/exception/index.ts";

export class VortexDBException extends KorevelException {
  static databaseNameRequired() {
    return new this("Database name is required");
  }
}
