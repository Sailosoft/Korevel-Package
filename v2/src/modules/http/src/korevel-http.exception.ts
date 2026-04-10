import { KorevelException } from "../../exception/index.ts";

export class KorevelHttpException extends KorevelException {
  static actionNotFound(action: string) {
    return new KorevelHttpException(`Action ${action} not found`);
  }
}
