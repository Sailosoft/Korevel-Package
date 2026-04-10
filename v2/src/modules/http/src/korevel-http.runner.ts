import { IKorevelContainer } from "../../container/index.ts";
import { KorevelEnvironmentProperty } from "../../environment/src/korevel-environment.enum.ts";
import { IKorevelRunner } from "../../runnable/index.ts";
import {
  IKorevelServerConfig,
  KorevelServerRunner,
} from "../../server/index.ts";
import { IKorevelHttpServer } from "../index.ts";

export class KorevelHttpRunner
  extends KorevelServerRunner
  implements IKorevelRunner
{
  async run(): Promise<void> {
    const server = this.app
      .getContainer()
      .resolve<IKorevelHttpServer>("httpServer");

    server.registerRoute();

    const container = this.app
      .getContainer()
      .resolve<IKorevelContainer>("korevelContainer");

    const serverConfig = this.app
      .getContainer()
      .resolve<IKorevelServerConfig>("serverConfig");

    this.logger.log("Server Engine Server URL: ", serverConfig.getBaseUrl());

    this.logger.log("Registrations", container.getRegistrations());

    await super.run();
  }
}
