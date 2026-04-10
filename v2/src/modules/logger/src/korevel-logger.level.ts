export enum KorevelLogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

export const KorevelLogColor: Record<KorevelLogLevel, string> = {
  [KorevelLogLevel.DEBUG]: "#08bcc9",
  [KorevelLogLevel.INFO]: "#20bd4fff",
  [KorevelLogLevel.WARN]: "#f39c12",
  [KorevelLogLevel.ERROR]: "#f04747",
  [KorevelLogLevel.NONE]: "#000000",
}