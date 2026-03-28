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
}

export interface IKorevelLoggerLogOption extends Partial<IKorevelLoggerModel> {
  message: string;
}

export interface IKorevelLogger {
  log(message: string, ...messageBody: any[]): void;

  logOption(option: IKorevelLoggerLogOption, ...messageBody: any[]): void;
}

export interface IKorevelLoggerSegment {
  tag: string;
  style: string;
}
