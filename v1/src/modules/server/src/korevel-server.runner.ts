import { IKorevel } from "../../core/index.ts";
import { IKorevelLogger, KorevelLogger } from "../../logger/index.ts";
import { KorevelEnvironmentProperty } from "../../environment/src/korevel-environment.enum.ts";
import { IKorevelRunner } from "../../runnable/index.ts";
import { IKorevelServerEngine } from "../index.ts";

export class KorevelServerRunner implements IKorevelRunner {
  logger: IKorevelLogger = new KorevelLogger({ instance: this });
  constructor(public app: IKorevel) {}
  async run(): Promise<void> {
    this.logger.log("Starting Server Engine Server...");
    this.logger.log(
      "Server Engine Server URL: ",
      this.app.getEnvironment().get(KorevelEnvironmentProperty.BASE_URL),
    );
    const engine = this.app
      .getContainer()
      .resolve<IKorevelServerEngine>("serverEngine");
    engine.createServer();
    this.logger.log("Server Engine Server Started");
  }
}
