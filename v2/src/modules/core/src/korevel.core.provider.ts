import { IKorevel, IKorevelProvider } from "./korevel.core.interface.ts";

export default class KorevelCoreProvider implements IKorevelProvider {
  register(app: IKorevel): void | Promise<void> {
    const container = app.getContainer();
    container.registerValue("app", app);
    container.registerValue("korevelContainer", container);
    container.registerValue("library", app.getLibrary());
    container.registerValue("environment", app.getEnvironment());
  }

  boot(app: IKorevel): void | Promise<void> {}
}
