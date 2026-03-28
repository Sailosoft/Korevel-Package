import KorevelUtilDateTime from "../../utils/korevel-util.datetime.ts";
import { IKorevelLoggerSegment } from "./korevel-logger.interface.ts";

export default class KorevelLoggerUtil {
  datetime = new KorevelUtilDateTime();

  getTimestamp({
    seconds = false,
    milliseconds = false,
  }: {
    seconds: boolean;
    milliseconds: boolean;
  }): string {
    return this.datetime.getTimestamp({ seconds, milliseconds });
  }

  genBoxSegment(
    tag: string,
    color: string,
    option?: {
      bold?: boolean;
    },
  ): IKorevelLoggerSegment {
    return {
      tag: `[${tag}]`,
      style: `color: ${color}; font-weight: ${option?.bold ? "bold" : "normal"};`,
    };
  }

  getPattern(segments: IKorevelLoggerSegment[]): string {
    return segments.map((s) => `%c${s.tag}`).join(" ");
  }

  getStyles(segments: IKorevelLoggerSegment[]): string[] {
    return segments.map((segment) => segment.style);
  }
}
