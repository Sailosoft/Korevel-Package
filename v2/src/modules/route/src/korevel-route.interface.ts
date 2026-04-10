export type KorevelHttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type KorevelHttpController = new (...args: any[]) => any;

export interface IKorevelRoute {
  name?: string;
  method: KorevelHttpMethod;
  path: string;
  controller: KorevelHttpController;
  action: string;
}
