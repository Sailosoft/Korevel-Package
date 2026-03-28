export type IKorevelEnvironmentValue =
  | string
  | number
  | boolean
  | object
  | Array<any>;

export type IKorevelTypeString =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "array";

export interface IKorevelEnvironmentProperty {
  name: string;
  type: IKorevelTypeString;
  required: boolean;
  default?: IKorevelEnvironmentValue;
}

export interface IKorevelEnvironment {
  registerEnvironment(property: IKorevelEnvironmentProperty): void;
  registerEnvironments(properties: IKorevelEnvironmentProperty[]): void;
  get(name: string): IKorevelEnvironmentValue;
  set(name: string, value: IKorevelEnvironmentValue): void;
}
