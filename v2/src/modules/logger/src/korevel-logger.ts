import {
  IKorevelLogger,
  IKorevelLoggerLogOption,
  IKorevelLoggerModel,
  IKoreveLoggerHasConstructor,
} from "./korevel-logger.interface.ts";

import {
  KorevelLoggerUtil,
  KorevelLoggerSegment,
  KorevelLogLevel,
  KorevelLogColor
} from "../index.ts";

export default class KorevelLogger
  implements IKorevelLogger, IKorevelLoggerModel {
  readonly utils: KorevelLoggerUtil;
  readonly segments: KorevelLoggerSegment;

  baseTag: string = "Korevel Server";
  baseTagColor: string = "#20bd4fff";
  scopeTag: string = "";
  scopeTagColor: string = "#3498db";
  instance?: IKoreveLoggerHasConstructor;
  timestampColor: string = "#888";
  showSeconds: boolean = true;
  showMilliseconds: boolean = false;
  level: KorevelLogLevel = KorevelLogLevel.DEBUG;

  constructor(options?: Partial<IKorevelLoggerModel>) {
    this.utils = new KorevelLoggerUtil();
    this.segments = new KorevelLoggerSegment(this.utils);
    if (options) {
      // Use Object.assign to copy properties safely to 'this'
      Object.assign(this, options);
    }
  }

  extend(options: Partial<IKorevelLoggerModel>) : IKorevelLogger {
    return new KorevelLogger({ ...this, ...options });
  }

  debug(message: string, ...messageBody: unknown[]) {
    this.logWithLevel(KorevelLogLevel.DEBUG, true, { message }, ...messageBody);
  }

  info(message: string, ...messageBody: unknown[]): void {
    this.logWithLevel(KorevelLogLevel.INFO, false, { message }, ...messageBody);
  }
  warn(message: string, ...messageBody: unknown[]): void {
    this.logWithLevel(KorevelLogLevel.WARN, true, { message }, ...messageBody);
  }

  error(message: string, ...messageBody: unknown[]) : void {
    this.logWithLevel(KorevelLogLevel.ERROR, true, { message }, ...messageBody);
  }

  log(message: string, ...messageBody: any[]): void {
    this.logOption({ message }, ...messageBody);
  }

  logOption(option: IKorevelLoggerLogOption, ...messageBody: unknown[]): void {
    const active = { ...this, ...option };

    const segments = this.segments.getSegments(active);
    const { pattern, styles } = this.segments.getPatternStyles(segments);

    console.info(pattern, ...styles, option.message, ...messageBody);
  }

  getLogLevel(): KorevelLogLevel {
    return this.level;
  }

  private logWithLevel(
    level: KorevelLogLevel,
    withColor: boolean,
    option: IKorevelLoggerLogOption,
    ...messageBody: unknown[]) {
    this.shouldLog(level) &&
      withColor
      ? this.logWithScopeTagColor(level, option, messageBody)
      : this.logOption(option, ...messageBody);
  }

  private logWithScopeTagColor(
    level: KorevelLogLevel,
    option: IKorevelLoggerLogOption,
    ...messageBody: unknown[]) {
    this.logOption(
      { ...option, scopeTagColor: KorevelLogColor[level] },
      ...messageBody
    );
  }

  private shouldLog(logLevel: KorevelLogLevel) {
    return this.level <= logLevel;
  }
}
