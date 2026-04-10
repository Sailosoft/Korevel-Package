import {
  KorevelHttpController,
  KorevelHttpMethod,
} from "../../route/src/korevel-route.interface.ts";
import {
  IKorevelRouterRegister,
  IKorevelRouterStore,
} from "./korevel-router.interface.ts";

export default class KorevelRouterRegister implements IKorevelRouterRegister {
  constructor(private routerStore: IKorevelRouterStore) {}

  private map(
    method: KorevelHttpMethod,
    path: string,
    controller: KorevelHttpController,
    action: string,
  ): void {
    this.routerStore.add({ method, path, controller, action });
  }

  get(path: string, ctrl: KorevelHttpController, action: string) {
    this.map("GET", path, ctrl, action);
  }
  post(path: string, ctrl: KorevelHttpController, action: string) {
    this.map("POST", path, ctrl, action);
  }
  put(path: string, ctrl: KorevelHttpController, action: string) {
    this.map("PUT", path, ctrl, action);
  }
  delete(path: string, ctrl: KorevelHttpController, action: string) {
    this.map("DELETE", path, ctrl, action);
  }
  patch(path: string, ctrl: KorevelHttpController, action: string) {
    this.map("PATCH", path, ctrl, action);
  }
}
