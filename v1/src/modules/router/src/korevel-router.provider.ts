import { IKorevel, IKorevelProvider } from "../../core/index.ts";
import { IKorevelRunnable } from "../../runnable/index.ts";
import {
  KorevelRouterRegister,
  KorevelRouterRunner,
  KorevelRouterStore,
  KorevelRouterValidation,
} from "../index.ts";
import KorevelRouterContainer from "./korevel-router.container.ts";
// import { KorevelRouter } from "../index.ts";

export default class KorevelRouterProvider implements IKorevelProvider {
  register(app: IKorevel): void | Promise<void> {
    app.getContainer().registerClass("routerStore", KorevelRouterStore, {
      lifetime: "SINGLETON",
    });

    app.getContainer().registerClass("routerRegister", KorevelRouterRegister, {
      lifetime: "SINGLETON",
    });

    app
      .getContainer()
      .registerClass("routerContainer", KorevelRouterContainer, {
        lifetime: "SINGLETON",
      });

    app
      .getContainer()
      .registerClass("routerValidation", KorevelRouterValidation, {
        lifetime: "SINGLETON",
      });

    app.getContainer().registerClass("routerRunner", KorevelRouterRunner, {
      lifetime: "SINGLETON",
    });
  }

  boot(app: IKorevel): void | Promise<void> {
    app
      .getContainer()
      .resolve<IKorevelRunnable>("runnable")
      .registerRunner(
        app.getContainer().resolve<KorevelRouterRunner>("routerRunner"),
      );
  }
}
