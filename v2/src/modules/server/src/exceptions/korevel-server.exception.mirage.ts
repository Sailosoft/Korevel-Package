import { KorevelException } from "../../../exception/index.ts";
import { IKorevelServerRouteMethod } from "../korevel-server.interface.ts";

export class KorevelServerExceptionMirage extends KorevelException {
  static serverMirageNotInitialized() {
    return new KorevelServerExceptionMirage("Server mirage not initialized");
  }

  static serverMirageMethodNotSupported(method: IKorevelServerRouteMethod) {
    return new KorevelServerExceptionMirage(
      `Server mirage method ${method} not supported`,
    );
  }
}
