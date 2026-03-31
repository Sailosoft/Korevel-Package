import { IKorevel, IKorevelProvider } from "../../core/index.ts";
import { IKorevelArtisan } from "./korevel-artisan.interface.ts";
import { KorevelArtisan } from "./korevel-artisan.ts";

declare global {
  interface Window {
    korevel: {
      artisan: IKorevelArtisan;
    };
  }
}

export class KorevelArtisanProvider implements IKorevelProvider {
  register(app: IKorevel): void {
    app.getContainer().registerClass("artisan", KorevelArtisan, {
      lifetime: "SINGLETON",
    });
  }

  boot(app: IKorevel): void {
    const container = app.getContainer();
    const artisan = container.resolve<KorevelArtisan>("artisan");

    // Expose to browser dev console
    if (typeof window !== "undefined") {
      window.korevel = window.korevel || {};
      window.korevel.artisan = artisan;

      // console.log(
      //   "%c Korevel Artisan %c Ready in Dev Console ",
      //   "background: #f4645f; color: #fff; border-radius: 3px 0 0 3px;",
      //   "background: #333; color: #fff; border-radius: 0 3px 3px 0;",
      // );
    }
  }
}
