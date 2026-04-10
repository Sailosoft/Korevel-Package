import { IKorevelRoute } from "../../route/index.ts";
import { IKorevelRouterValidation, KorevelRouterException } from "../index.ts";

export class KorevelRouterValidation implements IKorevelRouterValidation {
  validate(route: IKorevelRoute): void {
    if (!route.path.startsWith("/")) {
      throw KorevelRouterException.invalidPathStartsWith(route.path);
    }
  }
}
