export type KorevelHttpHandle = (
  request: IKorevelRequest<unknown>,
) => Promise<IKorevelResponse> | IKorevelResponse | unknown;

export interface IKorevelRequest<
  TBody = unknown,
  THeader = Record<string, string>,
> {
  id?: number;
  body: TBody;
  bodyString: string;
  url: string;
  queryParams: Record<string, string | string[] | null | undefined>;
  params: Record<string, string>;
  headers: THeader;
  originalRequest: unknown;
}

export interface IKorevelResponse<T = unknown> {
  type: "response";
  success: boolean;
  code?: number;
  data?: T;
  error?: string;
  headers?: { [key: string]: string };
}

export interface IKorevelHttpResponse<T = unknown> extends IKorevelResponse<T> {
  ok(data?: T): IKorevelResponse<T>;
  created(data?: T): IKorevelResponse<T>;
  noContent(): IKorevelResponse<T>;
  badRequest(error: string): IKorevelResponse<T>;
  unauthorized(error: string): IKorevelResponse<T>;
  forbidden(error: string): IKorevelResponse<T>;
  notFound(error: string): IKorevelResponse<T>;
  internalServerError(error: string): IKorevelResponse<T>;
  formError(errors: Record<string, string[] | string>): IKorevelResponse<T>;
  unprocessableEntity(
    errors: Record<string, string[] | string>,
  ): IKorevelResponse<T>;
}

export interface IKorevelHttpServer {
  registerRoute(): void;
}
