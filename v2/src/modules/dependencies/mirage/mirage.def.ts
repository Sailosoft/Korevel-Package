export interface IKorevelDepMirage {
  Server: IKorevelDepMirageServer;
}

export interface IKorevelDepMirageServer {
  createServer: CreateServer;
  Response: KorevelDepMirageResponseConstructor;
}

/**
 * Represents the Request object passed by Mirage JS to route handlers.
 */
export interface IKorevelDepMirageRequest {
  readonly requestBody: string;
  readonly url: string;
  readonly params: Record<string, string>;
  readonly queryParams: Record<string, string[] | string | null | undefined>;
  readonly requestHeaders: Record<string, string>;
}

/**
 * Type for Mirage route handlers
 */
export type KorevelDepMirageHandler = (
  schema: any,
  request: IKorevelDepMirageRequest,
) => any | IKorevelDepMirageResponse;

/**
 * Represents the low-level Pretender request object.
 */
export interface IKorevelDepMiragePretenderRequest extends IKorevelDepMirageRequest {
  readonly method: string;
  readonly status: number;
  readonly responseText: string;
}

export type KorevelDepMiragePretenderHandleRequest = (
  verb: any,
  path: any,
  request: any,
) => any;

/**
 * Interface for the underlying Pretender instance.
 */
export interface IKorevelDepMiragePretender {
  handledRequest: KorevelDepMiragePretenderHandleRequest;
  passthroughRequest: KorevelDepMiragePretenderHandleRequest;
  handledRequests: IKorevelDepMiragePretenderRequest[];
  unhandledRequests: IKorevelDepMiragePretenderRequest[];
  passthroughRequests: IKorevelDepMiragePretenderRequest[];

  registry: {
    get: any[];
    post: any[];
    put: any[];
    patch: any[];
    del: any[];
  };
}

export interface IKorevelDepMirageServer {
  db: any;
  schema: any;
  namespace: string;
  urlPrefix: string;
  timing: number;
  logging: boolean;

  /** * The underlying Pretender instance used by Mirage.
   * Useful for inspecting handledRequests in tests.
   */
  pretender: IKorevelDepMiragePretender;

  // Standard Route Methods
  get(path: string, handler: KorevelDepMirageHandler): void;
  post(path: string, handler: KorevelDepMirageHandler): void;
  put(path: string, handler: KorevelDepMirageHandler): void;
  patch(path: string, handler: KorevelDepMirageHandler): void;
  del(path: string, handler: KorevelDepMirageHandler): void;

  passthrough(...paths: string[]): void;
  shutdown(): void;
}

interface CreateServerOption {
  models?: Record<string, any>;
  factories?: Record<string, any>;
  seeds?: (server: any) => void;
  routes?: (this: IKorevelDepMirageServer) => void;
  baseApiUrl?: string;
  environment?: "development" | "test" | "production";
}

type CreateServer = (options: CreateServerOption) => void;

export interface IKorevelDepMirageResponse {
  code: number;
  headers: Record<string, string>;
  data: any;
}

/**
 * Type for the Mirage Response Constructor
 */
export type KorevelDepMirageResponseConstructor = new (
  code: number,
  headers?: Record<string, string>,
  data?: any,
) => IKorevelDepMirageResponse;
