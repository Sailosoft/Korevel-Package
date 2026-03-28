import { IKorevelProvider } from "../../core/index.ts";

export type IKorevelBuilderFn = (builder: IKorevelBuilder) => void;

export interface IKorevelBuilder {
  setDatabase(database: string): IKorevelBuilder;
  setProviders(providers: IKorevelProvider[]): IKorevelBuilder;
  setBaseUrl(url: string): IKorevelBuilder;
}

export interface IKorevelBuilderExtension<TMain> {
  build(builder: IKorevelBuilderFn): TMain;
}
