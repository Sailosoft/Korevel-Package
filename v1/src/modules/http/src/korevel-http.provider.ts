import { IKorevel, IKorevelProvider } from "../../core/index.ts";
import { IKorevelRunnable, IKorevelRunner } from "../../runnable/index.ts";
import { KorevelHttpRunner, KorevelHttpServer } from "../index.ts";

export class KorevelHttpProvider implements IKorevelProvider {
  register(app: IKorevel): void | Promise<void> {
    const container = app.getContainer();
    container.registerClass("httpServer", KorevelHttpServer, {
      lifetime: "SINGLETON",
    });

    container.registerClass("defaultRunner", KorevelHttpRunner, {
      lifetime: "SINGLETON",
    });
  }

  boot(app: IKorevel): void | Promise<void> {
    const runnable = app.getContainer().resolve<IKorevelRunnable>("runnable");
    runnable.registerRunner(
      app.getContainer().resolve<IKorevelRunner>("defaultRunner"),
    );
  }
}
