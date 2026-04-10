import { IKorevelRoute } from "../../route/index.ts";
import {
  IKorevelRouterStore,
  IKorevelRouterValidation,
  KorevelRouterException,
} from "../index.ts";

export default class KorevelRouterStore<
  T extends IKorevelRoute,
> implements IKorevelRouterStore {
  private routes: Map<string, T> = new Map();
  private validation: IKorevelRouterValidation;

  constructor(routerValidation: IKorevelRouterValidation) {
    this.validation = routerValidation;
  }

  getKey(route: T): string {
    return `${route.method}:${route.path}`;
  }

  has(route: T): boolean {
    return this.routes.has(this.getKey(route));
  }

  add(route: T): void {
    if (this.has(route)) {
      throw KorevelRouterException.throwRouteAlreadyRegistered(route.path);
    }

    this.routes.set(this.getKey(route), route);
  }

  addMany(routes: T[]): void {
    routes.forEach((route) => {
      this.add(route);
    });
  }

  get(name: string): T {
    const route = this.routes.get(name);

    if (route === undefined) {
      throw KorevelRouterException.throwRouteNotFound(name);
    }

    return route;
  }

  getAll(): T[] {
    return Array.from(this.routes.values());
  }
}
