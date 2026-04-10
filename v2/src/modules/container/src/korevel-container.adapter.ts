import {
  IKorevelDepAwilix,
  IKorevelDepAwilixContainer,
} from "../../dependencies/index.ts";
import { IKorevelLibrary } from "../../library/index.ts";
import { IKorevelLogger, KorevelLogger } from "../../logger/index.ts";
import {
  IKorevelContainerAdapter,
  IKorevelContainerClassRef,
  IKorevelContainerRegistrationOptions,
} from "../index.ts";

export default class KorevelContainerAdapter implements IKorevelContainerAdapter {
  logger: IKorevelLogger;
  container: IKorevelDepAwilixContainer;
  awilix: IKorevelDepAwilix;

  constructor(
    public library: IKorevelLibrary,
    container?: IKorevelDepAwilixContainer,
  ) {
    this.logger = new KorevelLogger({ instance: this });
    this.container =
      container ||
      library.awilix.createContainer({
        injectionMode: "CLASSIC",
      });
    this.awilix = library.awilix;
  }

  registerValue<T>(name: string, value: T): void {
    this.container.register({
      [name]: this.awilix.asValue(value),
    });
  }

  registerClass(
    name: string,
    classRef: IKorevelContainerClassRef,
    options?: IKorevelContainerRegistrationOptions,
  ): void {
    this.container.register({
      [name]: this.awilix.asClass(classRef, {
        lifetime: "SCOPED",
        ...options,
      }),
    });
  }

  resolve<T>(name: string): T {
    return this.container.resolve<T>(name);
  }

  has(name: string): boolean {
    return this.container.hasRegistration(name);
  }

  getRegistrations(): Record<string | symbol, any> {
    return this.container.registrations;
  }

  createScope(): IKorevelContainerAdapter {
    const scopedContainer = this.container.createScope();
    this.logger.log("Created new scoped container.");
    return new KorevelContainerAdapter(this.library, scopedContainer);
  }

  async disposeAsync(): Promise<void> {
    return await this.container.dispose();
  }
}
