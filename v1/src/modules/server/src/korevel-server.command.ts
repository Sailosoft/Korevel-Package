import { KorevelLogger } from "../../logger/index.ts";
import {
  IKorevelArtisanCommand,
  IKorevelArtisanCommandInput,
} from "../../artisan/index.ts";
import { IKorevelServerRouter } from "../index.ts";

export class KorevelServerCommand implements IKorevelArtisanCommand {
  signature: string = "server:list {name}";
  description?: string | undefined = "Server List";
  handle(input: IKorevelArtisanCommandInput): Promise<void> | void {
    console.log("Server List");
    console.log(input);
  }
}

export class KorevelServerCommandRouteList implements IKorevelArtisanCommand {
  logger = new KorevelLogger({
    instance: this,
  });
  constructor(private serverRouter: IKorevelServerRouter) {}
  signature: string = "server:route:list";
  description?: string | undefined = "Server Route List";
  handle(): Promise<void> | void {
    this.logger.log("Server Route List", this.serverRouter.getRoutes());
  }
}
