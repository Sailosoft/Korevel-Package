import { IKorevelRouterContainer } from "../index.ts";
import { IKorevelRunner } from "../../runnable/index.ts";
import { KorevelLogger } from "../../logger/index.ts";

export class KorevelRouterRunner implements IKorevelRunner {
  logger = new KorevelLogger({ instance: this });
  constructor(private routerContainer: IKorevelRouterContainer) {}

  async run() {
    this.logger.log("Registering routes to container");
    this.routerContainer.registerToContainer();
    this.logger.log("Routes registered to container");
  }
}
