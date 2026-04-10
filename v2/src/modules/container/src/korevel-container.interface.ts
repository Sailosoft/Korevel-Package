export type IKorevelContainerLifetime = "SINGLETON" | "SCOPED" | "TRANSIENT";

export type IKorevelContainerClassRef = new (...args: any[]) => any;

export interface IKorevelContainerRegistrationOptions {
  lifetime?: IKorevelContainerLifetime;
}

export interface IKorevelContainerAdapter {
  registerValue<T>(name: string, value: T): void;
  registerClass(
    name: string,
    classRef: IKorevelContainerClassRef,
    options?: IKorevelContainerRegistrationOptions,
  ): void;

  resolve<T>(name: string): T;
  has(name: string): boolean;
  getRegistrations(): Record<string | symbol, any>;
  createScope(): IKorevelContainerAdapter;
  disposeAsync(): Promise<void>;
}

export interface IKorevelContainer {
  resolve<T>(name: string): T;
  has(name: string): boolean;
  registerClass(
    name: string,
    classRef: IKorevelContainerClassRef,
    options?: IKorevelContainerRegistrationOptions,
  ): void;
  registerValue<T>(name: string, value: T): void;
  getRegistrations(): Record<string | symbol, any>;
  createScope(): IKorevelContainerAdapter;
}
