import { IKorevelResponse } from "../index.ts";
import { KorevelHttpResponse } from "./korevel-http.response.ts";

/**
 * Base Controller for the Korevel Framework.
 * Provides a standardized interface for all HTTP responses.
 */
export abstract class KorevelHttpController {
  /**
   * Internal factory to generate a clean response instance.
   */
  private res<T>(): KorevelHttpResponse<T> {
    return KorevelHttpResponse.emptyMake<T>();
  }

  // --- 2xx Success Responses ---

  public ok<T>(data?: T): IKorevelResponse<T> {
    return this.res<T>().ok(data);
  }

  public created<T>(data?: T): IKorevelResponse<T> {
    return this.res<T>().created(data);
  }

  public noContent<T>(): IKorevelResponse<T> {
    return this.res<T>().noContent();
  }

  // --- 4xx Client Error Responses ---

  public badRequest<T>(error: string): IKorevelResponse<T> {
    return this.res<T>().badRequest(error);
  }

  public unauthorized<T>(error: string): IKorevelResponse<T> {
    return this.res<T>().unauthorized(error);
  }

  public forbidden<T>(error: string): IKorevelResponse<T> {
    return this.res<T>().forbidden(error);
  }

  public notFound<T>(error: string): IKorevelResponse<T> {
    return this.res<T>().notFound(error);
  }

  // --- 422 Validation Responses ---

  public formError<T>(
    errors: Record<string, string[] | string>,
  ): IKorevelResponse<T> {
    return this.res<T>().formError(errors);
  }

  public unprocessableEntity<T>(
    errors: Record<string, string[] | string>,
  ): IKorevelResponse<T> {
    return this.res<T>().unprocessableEntity(errors);
  }

  // --- 5xx Server Error Responses ---

  public internalServerError<T>(error: string): IKorevelResponse<T> {
    return this.res<T>().internalServerError(error);
  }
}
