import { IKorevelHttpResponse, IKorevelResponse } from "../index.ts";

export class KorevelHttpResponse<T> implements IKorevelHttpResponse<T> {
  default: IKorevelResponse<T> = {
    type: "response",
    success: true,
    code: 200,
  };

  constructor(
    public type: "response",
    public success: boolean,
    public code?: number,
    public data?: T,
    public error?: string,
    public headers?: { [key: string]: string },
  ) {}

  static emptyMake<T>(): KorevelHttpResponse<T> {
    return new KorevelHttpResponse<T>("response", true);
  }

  static make<T>({
    code,
    success,
    data,
    error,
    headers,
  }: {
    code?: number;
    success?: boolean;
    data?: T;
    error?: string;
    headers?: { [key: string]: string };
  }): KorevelHttpResponse<T> {
    return new KorevelHttpResponse<T>(
      "response",
      success ?? (code ?? 200) < 300,
      code ?? 200,
      data,
      error,
      headers,
    );
  }

  ok(data?: T): IKorevelResponse<T> {
    return {
      type: "response",
      success: true,
      code: 200,
      data,
    };
  }

  created(data?: T): IKorevelResponse<T> {
    return {
      type: "response",
      success: true,
      code: 201,
      data,
    };
  }

  noContent(): IKorevelResponse<T> {
    return {
      type: "response",
      success: true,
      code: 204,
    };
  }

  badRequest(error: string): IKorevelResponse<T> {
    return {
      type: "response",
      success: false,
      code: 400,
      error,
    };
  }

  unauthorized(error: string): IKorevelResponse<T> {
    return {
      type: "response",
      success: false,
      code: 401,
      error,
    };
  }

  forbidden(error: string): IKorevelResponse<T> {
    return {
      type: "response",
      success: false,
      code: 403,
      error,
    };
  }

  notFound(error: string): IKorevelResponse<T> {
    return {
      type: "response",
      success: false,
      code: 404,
      error,
    };
  }

  internalServerError(error: string): IKorevelResponse<T> {
    return {
      type: "response",
      success: false,
      code: 500,
      error,
    };
  }

  formError(errors: Record<string, string[] | string>): IKorevelResponse<T> {
    return {
      type: "response",
      success: false,
      code: 422,
      error: JSON.stringify(errors),
    };
  }

  unprocessableEntity(
    errors: Record<string, string[] | string>,
  ): IKorevelResponse<T> {
    return {
      type: "response",
      success: false,
      code: 422,
      error: JSON.stringify(errors),
    };
  }
}
