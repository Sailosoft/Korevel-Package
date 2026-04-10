import {
  KorevelDepMiragePretenderHandleRequest,
  korevelMirage,
} from "../../../dependencies/index.ts";
import { IKorevelLogger, KorevelLogger } from "../../../logger/index.ts";
import {
  IKorevelServerConfig,
  IKorevelServerEngine,
  IKorevelServerRouter,
  KorevelServerExtensionMirage,
} from "../../index.ts";

export class KorevelServerEngineMirage implements IKorevelServerEngine {
  extension = new KorevelServerExtensionMirage();
  logger: IKorevelLogger = new KorevelLogger({ instance: this });
  public constructor(
    public serverConfig: IKorevelServerConfig,
    public serverRouter: IKorevelServerRouter,
  ) {}
  createServer(): void {
    const mirage = korevelMirage;
    const engine = this;
    const { routeHandle } = this.extension;
    const isPassthroughLogging = false;

    mirage.Server.createServer({
      routes() {
        // this.logging = false;
        this.timing = engine.serverConfig.getTiming();
        this.namespace = engine.serverConfig.getNamespace();
        this.urlPrefix = engine.serverConfig.getBaseUrl();
        const routes = engine.serverRouter.getRoutes();

        engine.logger.log("Logging Server Environment", {
          timing: this.timing,
          namespace: this.namespace,
          urlPrefix: this.urlPrefix,
          routes: routes,
        });

        routes.forEach((route) => {
          routeHandle(route, this);
        });

        this.get("/health-check", (request) => {
          engine.logger.log("Health Check", request);
          return {
            message: "Korevel Server Engine is Running",
          };
        });

        // passthrough
        this.namespace = "";
        this.urlPrefix = "";

        engine.logger.log("Logging Passthrough URL", {
          passthroughUrl: engine.serverConfig.getPassthroughUrl(),
        });

        const originalHandler = this.pretender.passthroughRequest;

        const newHandler: KorevelDepMiragePretenderHandleRequest = (
          ...options
        ) => {
          this.logging = isPassthroughLogging;

          originalHandler(...options);
          this.logging = !isPassthroughLogging;
        };

        this.pretender.passthroughRequest = newHandler;

        // this.logging = isPassthroughLogging;
        engine.serverConfig.getPassthroughUrl().forEach((url) => {
          this.passthrough(url);
        });

        // reset namespace
        this.namespace = engine.serverConfig.getNamespace();
        this.urlPrefix = engine.serverConfig.getBaseUrl();
        // this.pretender.handledRequest = originalHandler;
      },
    });
  }
}
