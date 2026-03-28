import { IKorevel, IKorevelProvider } from "../../core/index.ts";
import { KorevelRunnable } from "../index.ts";

export class KorevelRunnableProvider implements IKorevelProvider {
  register(app: IKorevel): void {
    app.getContainer().registerClass("runnable", KorevelRunnable, {
      lifetime: "SINGLETON",
    });
  }

  boot(): void {}
}
