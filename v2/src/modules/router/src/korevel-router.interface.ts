import { IKorevelRoute, KorevelHttpController } from "../../route/index.ts";

export type KorevelRouteHandler = (
  path: string,
  controller: KorevelHttpController,
  action: string,
) => void;

export interface IKorevelRouterStore {
  has(route: IKorevelRoute): boolean;
  add(route: IKorevelRoute): void;
  addMany(routes: IKorevelRoute[]): void;
  get(name: string): IKorevelRoute;
  getAll(): IKorevelRoute[];
  getKey(route: IKorevelRoute): string;
}

export interface IKorevelRouterContainer {
  registerToContainer(): void;
}

export interface IKorevelRouterValidation {
  validate(route: IKorevelRoute): void;
}

export interface IKorevelRouterRegister {
  get: KorevelRouteHandler;
  post: KorevelRouteHandler;
  put: KorevelRouteHandler;
  delete: KorevelRouteHandler;
  patch: KorevelRouteHandler;
}

// export type KorevelControllerActionOption = {
//   name?: string;
// };

// export type KorevelRouteHandler = (
//   path: string,
//   controllerAction: KorevelControllerAction,
//   option?: KorevelControllerActionOption,
// ) => void;

// export type KorevelRoute = {
//   name?: string;
//   method: KorevelMethod;
//   path: string;
//   action: string;
//   controller: KorevelController;
// };

// export interface IKorevelRouterRegistry {
//   get: KorevelRouteHandler;
//   post: KorevelRouteHandler;
//   put: KorevelRouteHandler;
//   delete: KorevelRouteHandler;
//   patch: KorevelRouteHandler;
// }

// export interface IKorevelRouteStore {
//   hasRoute(route: KorevelRoute): boolean;
//   addRoute(route: KorevelRoute): void;
//   addRoutes(routes: KorevelRoute[]): void;
//   getRoute(name: string): KorevelRoute;
//   getRoutes(): KorevelRoute[];
// }

// export interface IKorevelRouterContainerRegistry {
//   getDistinctControllers(): KorevelController[];
//   registerToContainer(controller: KorevelController): void;
//   registerDistinctControllersToContainer(): void;
// }

// export interface IKorevelRouterKernel {
//   store: IKorevelRouteStore;
//   registry: IKorevelRouterRegistry;
//   routerContainer: IKorevelRouterContainerRegistry;
//   facade: IKorevelRouteFacade;
// }

// export interface IKorevelRouteFacade extends Omit<
//   IKorevelRouterRegistry,
//   "store"
// > {
//   registerRouteToContainer(): void;
// }
