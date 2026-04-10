import { KorevelException } from "../../exception/index.ts";

export default class KorevelRouterException extends KorevelException {
  static throwRouteNotFound(name: string): KorevelRouterException {
    return new KorevelRouterException(`Route ${name} not found`);
  }

  static invalidPathStartsWith(path: string): KorevelRouterException {
    return new KorevelRouterException(`Path ${path} must start with /`);
  }

  static throwRouteAlreadyRegistered(path: string): KorevelRouterException {
    return new KorevelRouterException(`Route ${path} already registered`);
  }
}
