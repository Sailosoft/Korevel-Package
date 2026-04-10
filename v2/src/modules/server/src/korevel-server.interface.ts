import { KorevelHttpHandle } from "../../http/src/korevel-http.interface.ts";

export type IKorevelServerRouteMethod =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch";

export interface IKorevelServerRoute {
  path: string;
  method: IKorevelServerRouteMethod;
  handle: KorevelHttpHandle;
}

export interface IKorevelServerConfig {
  setTiming(timing: number): void;
  setNamespace(namespace: string): void;
  setBaseUrl(baseUrl: string): void;
  setPassthroughUrl(passthroughUrl: string[]): void;
  getTiming(): number;
  getNamespace(): string;
  getBaseUrl(): string;
  getPassthroughUrl(): string[];
}

export interface IKorevelServerEngine {
  createServer(): void;
}

export interface IKorevelServerRouter {
  getRoutes(): IKorevelServerRoute[];
  get(path: string, handle: KorevelHttpHandle): void;
  post(path: string, handle: KorevelHttpHandle): void;
  put(path: string, handle: KorevelHttpHandle): void;
  delete(path: string, handle: KorevelHttpHandle): void;
  patch(path: string, handle: KorevelHttpHandle): void;
}
