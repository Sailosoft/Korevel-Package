import { KorevelLogLevel } from './korevel-logger.level.ts';

export interface IKoreveLoggerHasConstructor {
  constructor: { name: string };
}

export interface IKorevelLoggerModel {
  instance?: IKoreveLoggerHasConstructor;
  baseTag: string;
  baseTagColor: string;
  timestampColor: string;
  scopeTag: string;
  scopeTagColor: string;
  showSeconds: boolean;
  showMilliseconds: boolean;
  level: KorevelLogLevel;
}

export interface IKorevelLoggerLogOption extends Partial<IKorevelLoggerModel> {
  message: string;
}

export interface IKorevelLogger {
  /**
   * Spawns a new logger instance inheriting settings from the current one.
   */
  extend(options: Partial<IKorevelLoggerModel>): IKorevelLogger;

  /**
   * Standard log output without a specific level priority.
   */
  log(message: string, ...messageBody: any[]): void;

  /**
   * Log with full configuration overrides.
   */
  logOption(option: IKorevelLoggerLogOption, ...messageBody: any[]): void;

  /**
   * Log a debug-level message.
   */
  debug(message: string, ...messageBody: any[]): void;

  /**
   * Log an info-level message.
   */
  info(message: string, ...messageBody: any[]): void;

  /**
   * Log a warning-level message.
   */
  warn(message: string, ...messageBody: any[]): void;

  /**
   * Log an error-level message.
   */
  error(message: string, ...messageBody: any[]): void;
  /**
   *
   */
  getLogLevel(): KorevelLogLevel;
}

export interface IKorevelLoggerSegment {
  tag: string;
  style: string;
}
