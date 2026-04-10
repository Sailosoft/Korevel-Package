import { IKorevelProvider } from "../../core/index.ts";
import { KorevelLogLevel } from '../../logger/index.ts';

export type IKorevelBuilderFn = (builder: IKorevelBuilder) => void;

export interface IKorevelBuilder {
  setDatabase(database: string): IKorevelBuilder;
  setProviders(providers: IKorevelProvider[]): IKorevelBuilder;
  setBaseUrl(url: string): IKorevelBuilder;
  setLogLevel(level: KorevelLogLevel): IKorevelBuilder;
}

export interface IKorevelBuilderExtension<TMain> {
  build(builder: IKorevelBuilderFn): TMain;
}
