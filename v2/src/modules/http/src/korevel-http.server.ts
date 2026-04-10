import { IKorevelContainer } from "../../container/index.ts";
import { IKorevel } from "../../core/index.ts";
import { KorevelEnvironmentProperty } from "../../environment/src/korevel-environment.enum.ts";
import { IKorevelLibrary } from "../../library/index.ts";
import { KorevelLogger } from "../../logger/index.ts";
import { IKorevelRoute } from "../../route/index.ts";
import { IKorevelRouterStore } from "../../router/index.ts";
import {
  IKorevelServerConfig,
  IKorevelServerRouter,
} from "../../server/index.ts";
import { IKorevelHttpServer, IKorevelRequest } from "../index.ts";
import { KorevelHttpException } from "./korevel-http.exception.ts";
import { KorevelHttpLib } from "./korevel-http.lib.ts";

export class KorevelHttpServer implements IKorevelHttpServer {
  logger = new KorevelLogger({ instance: this });
  lib = new KorevelHttpLib();
  constructor(
    private serverRouter: IKorevelServerRouter,
    private routerStore: IKorevelRouterStore,
    private korevelContainer: IKorevelContainer,
    private serverConfig: IKorevelServerConfig,
    private app: IKorevel,
    private library: IKorevelLibrary,
  ) {}

  registerRoute(): void {
    this.logger.log("Registering Http Routes...");
    const routes = this.routerStore.getAll();
    this.logger.log("Routes", routes);

    const baseUrl = this.app
      .getEnvironment()
      .get(KorevelEnvironmentProperty.BASE_URL);

    this.logger.log(`Registering BaseUrl: ${baseUrl}`);
    this.serverConfig.setBaseUrl(baseUrl.toString());

    const mirage = this.library.mirage;

    const mapAction = async (
      route: IKorevelRoute,
      request: IKorevelRequest<any>,
    ) => {
      const scope = this.korevelContainer.createScope();

      try {
        const controller: any = this.korevelContainer.resolve(
          route.controller.name,
        );

        const action = controller[route.action];

        if (!action) {
          throw KorevelHttpException.actionNotFound(route.action);
        }

        const rawResponse = await action.apply(controller, [request]);

        // Handling Korevel Response
        return this.lib.handleResponse(rawResponse, mirage);
      } catch (error) {
        throw error;
      } finally {
        await scope.disposeAsync();
      }
    };

    routes.forEach((route) => {
      this.logger.log("Mapping Action...", route);
      switch (route.method) {
        case "GET":
          this.serverRouter.get(route.path, async (request) => {
            return await mapAction(route, request);
          });
          break;
        case "POST":
          this.serverRouter.post(route.path, async (request) => {
            return mapAction(route, request);
          });
          break;
        case "PUT":
          this.serverRouter.put(route.path, async (request) => {
            return await mapAction(route, request);
          });
          break;
        case "DELETE":
          this.serverRouter.delete(route.path, async (request) => {
            return await mapAction(route, request);
          });
          break;
        case "PATCH":
          this.serverRouter.patch(route.path, async (request) => {
            return await mapAction(route, request);
          });
          break;
      }
    });
  }
}
