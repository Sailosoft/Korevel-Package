import {
  IKorevelDepMirageRequest,
  IKorevelDepMirageServer,
} from "../../../dependencies/mirage/mirage.def.ts";
import { IKorevelRequest, IKorevelResponse } from "../../../http/index.ts";
import {
  IKorevelServerRoute,
  KorevelServerExceptionMirage,
} from "../../index.ts";
import { KorevelLogger } from "../../../logger/index.ts";
import { korevelMirage } from "../../../dependencies/index.ts";

export class KorevelServerExtensionMirage {
  static createHttpRequestPayload<T = unknown>(
    request: IKorevelDepMirageRequest,
  ): IKorevelRequest<T> {
    let parsedBody: unknown = undefined;

    if (request.requestBody) {
      try {
        parsedBody = JSON.parse(request.requestBody);
      } catch {
        parsedBody = request.requestBody;
      }
    }

    const payload: IKorevelRequest<T> = {
      id: request.params?.id ? Number(request.params.id) : undefined,
      body: parsedBody as T,
      url: request.url,
      queryParams: request.queryParams,
      params: request.params,
      bodyString: request.requestBody,
      headers: request.requestHeaders,
      originalRequest: request,
    };

    return payload;
  }

  static mapHandle(
    route: IKorevelServerRoute,
    request: IKorevelDepMirageRequest,
  ) {
    const req = KorevelServerExtensionMirage.createHttpRequestPayload(request);
    const response = route.handle(req);

    if (
      response &&
      typeof response === "object" &&
      "type" in response &&
      response.type === "response"
    ) {
      const res = response as IKorevelResponse<unknown>;

      const mirage = korevelMirage;
      // Convert to Mirage Response (most important part!)
      return new mirage.Server.Response(
        res.code ?? 200,
        res.headers ?? {}, // default empty headers
        res.success === false && res.error
          ? { message: res.error } // or { error: res.error } — Laravel style
          : (res.data ?? null),
      );
    }

    return response;
  }

  routeHandle(route: IKorevelServerRoute, server: IKorevelDepMirageServer) {
    const logger = new KorevelLogger({
      scopeTag: "Korevel Mirage Route Handling",
    });
    logger.log("Mapping Mirage Server Route...", route);
    switch (route.method) {
      case "get":
        server.get(route.path, (_, request) => {
          return KorevelServerExtensionMirage.mapHandle(route, request);
        });
        break;
      case "post":
        server.post(route.path, (_, request) => {
          return KorevelServerExtensionMirage.mapHandle(route, request);
        });
        break;
      case "put":
        server.put(route.path, (_, request) => {
          return KorevelServerExtensionMirage.mapHandle(route, request);
        });
        break;
      case "delete":
        server.del(route.path, (_, request) => {
          return KorevelServerExtensionMirage.mapHandle(route, request);
        });
        break;
      case "patch":
        server.patch(route.path, (_, request) => {
          return KorevelServerExtensionMirage.mapHandle(route, request);
        });
        break;
      default:
        throw KorevelServerExceptionMirage.serverMirageMethodNotSupported(
          route.method,
        );
    }
  }
}
