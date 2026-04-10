import { KorevelException } from "../../exception/index.ts";

export default class KorevelCoreException extends KorevelException {
  static createContainerException() {
    return new KorevelCoreException("Container not created");
  }
}
