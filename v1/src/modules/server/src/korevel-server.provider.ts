import { IKorevelArtisan } from "../../artisan/index.ts";
import { IKorevel, IKorevelProvider } from "../../core/index.ts";
import {
  KorevelServerCommand,
  KorevelServerCommandRouteList,
  KorevelServerConfig,
  KorevelServerEngineMirage,
  KorevelServerRouter,
} from "../index.ts";

export class KorevelServerProvider implements IKorevelProvider {
  register(app: IKorevel): void | Promise<void> {
    app.getContainer().registerClass("serverConfig", KorevelServerConfig, {
      lifetime: "SINGLETON",
    });

    app
      .getContainer()
      .registerClass("serverEngine", KorevelServerEngineMirage, {
        lifetime: "SINGLETON",
      });

    app.getContainer().registerClass("serverRouter", KorevelServerRouter, {
      lifetime: "SINGLETON",
    });
  }

  boot(app: IKorevel): void | Promise<void> {
    const artisan = app.getContainer().resolve<IKorevelArtisan>("artisan");

    artisan.registerCommand("server:list", KorevelServerCommand);
    artisan.registerCommand("server:route:list", KorevelServerCommandRouteList);
  }
}
