import { IKorevelDepMirage } from "../../dependencies/index.ts";
import { IKorevelResponse } from "../index.ts";

export class KorevelHttpLib {
  handleResponse(response: IKorevelResponse<any>, mirage: IKorevelDepMirage) {
    if (response?.type === "response") {
      const payload = response.success
        ? response.data
        : { success: false, error: response.error };

      return new mirage.Server.Response(
        response.code || 200,
        {
          "Content-Type": "application/json",
          ...response.headers,
        },
        payload,
      );
    }

    return response;
  }
}
