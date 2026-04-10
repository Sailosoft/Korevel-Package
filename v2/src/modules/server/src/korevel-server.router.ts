import { KorevelHttpHandle } from "../../http/src/korevel-http.interface.ts";
import { IKorevelServerRoute, IKorevelServerRouter } from "../index.ts";

export class KorevelServerRouter implements IKorevelServerRouter {
  private routes: IKorevelServerRoute[] = [];

  getRoutes(): IKorevelServerRoute[] {
    return this.routes;
  }
  get(path: string, handle: KorevelHttpHandle): void {
    this.routes.push({
      path,
      method: "get",
      handle,
    });
  }
  post(path: string, handle: KorevelHttpHandle): void {
    this.routes.push({
      path,
      method: "post",
      handle,
    });
  }
  put(path: string, handle: KorevelHttpHandle): void {
    this.routes.push({
      path,
      method: "put",
      handle,
    });
  }
  delete(path: string, handle: KorevelHttpHandle): void {
    this.routes.push({
      path,
      method: "delete",
      handle,
    });
  }
  patch(path: string, handle: KorevelHttpHandle): void {
    this.routes.push({
      path,
      method: "patch",
      handle,
    });
  }
}
