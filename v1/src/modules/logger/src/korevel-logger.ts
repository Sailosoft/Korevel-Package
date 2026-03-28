import {
  IKorevelLogger,
  IKorevelLoggerLogOption,
  IKorevelLoggerModel,
  IKorevelLoggerSegment,
  IKoreveLoggerHasConstructor,
} from "./korevel-logger.interface.ts";
import KorevelLoggerUtil from "./korevel-logger.util.ts";

export default class KorevelLogger
  implements IKorevelLogger, IKorevelLoggerModel
{
  readonly utils: KorevelLoggerUtil;

  baseTag: string = "Korevel Server";
  baseTagColor: string = "#20bd4fff";
  scopeTag: string = "";
  scopeTagColor: string = "#3498db";
  instance?: IKoreveLoggerHasConstructor;
  timestampColor: string = "#888";
  showSeconds: boolean = true;
  showMilliseconds: boolean = false;

  constructor(options?: Partial<IKorevelLoggerModel>) {
    this.utils = new KorevelLoggerUtil();
    if (options) {
      // Use Object.assign to copy properties safely to 'this'
      Object.assign(this, options);
    }
  }

  log(message: string, ...messageBody: unknown[]): void {
    this.logOption({ message }, ...messageBody);
  }

  logOption(option: IKorevelLoggerLogOption, ...messageBody: unknown[]): void {
    // 1. Create a local merged configuration for this specific log call
    // This replaces the invalid "this = ..." logic
    const active = { ...this, ...option };

    // 2. Build segments using the 'active' merged data
    const segments: IKorevelLoggerSegment[] = [
      this.utils.genBoxSegment(active.baseTag, active.baseTagColor),
      this.utils.genBoxSegment(
        this.utils.datetime.getTimestamp({
          seconds: active.showSeconds,
          milliseconds: active.showMilliseconds,
        }),
        active.timestampColor,
        { bold: false },
      ),
      this.getScopeSegment(active),
    ];

    // 3. Generate pattern and styles
    const pattern = `${this.utils.getPattern(segments)}:`;
    const styles = this.utils.getStyles(segments);

    // 4. Output
    console.info(pattern, ...styles, option.message, ...messageBody);
  }

  /**
   * Helper to determine which scope tag to show based on active config
   */
  private getScopeSegment(active: IKorevelLoggerModel): IKorevelLoggerSegment {
    const scopeText =
      active.scopeTag || active.instance?.constructor.name || "Anonymous";

    return this.utils.genBoxSegment(scopeText, active.scopeTagColor);
  }
}
