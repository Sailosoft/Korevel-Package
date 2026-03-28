import { IKorevelLibrary } from "../../library/index.ts";
import {
  IKorevelContainer,
  IKorevelContainerAdapter,
  IKorevelContainerClassRef,
  IKorevelContainerRegistrationOptions,
  KorevelContainerAdapter,
} from "../index.ts";

export default class KorevelContainer implements IKorevelContainer {
  adapter: IKorevelContainerAdapter;
  constructor(library: IKorevelLibrary) {
    this.adapter = new KorevelContainerAdapter(library);
  }
  resolve<T>(name: string): T {
    return this.adapter.resolve<T>(name);
  }

  has(name: string): boolean {
    return this.adapter.has(name);
  }

  registerClass(
    name: string,
    classRef: IKorevelContainerClassRef,
    options?: IKorevelContainerRegistrationOptions,
  ): void {
    this.adapter.registerClass(name, classRef, options);
  }

  registerValue<T>(name: string, value: T): void {
    this.adapter.registerValue(name, value);
  }

  getRegistrations(): Record<string | symbol, any> {
    return this.adapter.getRegistrations();
  }

  createScope(): IKorevelContainerAdapter {
    return this.adapter.createScope();
  }
}
