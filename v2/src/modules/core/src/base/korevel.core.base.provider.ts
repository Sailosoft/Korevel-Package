import { IKorevel, IKorevelProvider } from "../../index.ts";

export default abstract class KorevelCoreBaseProvider implements IKorevelProvider {
  register(app: IKorevel): void | Promise<void> {
    this.appRegister(app);
  }

  boot(app: IKorevel): void | Promise<void> {
    this.appBoot(app);
  }

  appRegister(app: IKorevel): void | Promise<void> {}

  appBoot(app: IKorevel): void | Promise<void> {}
}
