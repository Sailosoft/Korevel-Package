import KorevelEnvironmentException from "./korevel-environment.exception.ts";
import {
  IKorevelEnvironment,
  IKorevelEnvironmentValue,
  IKorevelEnvironmentProperty,
} from "./korevel-environment.interface.ts";

export default class KorevelEnvironment implements IKorevelEnvironment {
  private values = new Map<string, IKorevelEnvironmentValue>();
  public readonly properties: Map<string, IKorevelEnvironmentProperty>;

  constructor() {
    this.properties = new Map<string, IKorevelEnvironmentProperty>();
  }

  registerEnvironment(property: IKorevelEnvironmentProperty): void {
    this.properties.set(property.name, property);
  }

  registerEnvironments(properties: IKorevelEnvironmentProperty[]): void {
    properties.forEach((property) => this.registerEnvironment(property));
  }

  /**
   * Type-safe getter
   */
  public get<T extends IKorevelEnvironmentValue>(name: string): T {
    const value = this.values.get(name);

    if (value === undefined) {
      const prop = this.properties.get(name);
      if (prop?.required) {
        throw KorevelEnvironmentException.missingRequiredProperty(name);
      }
    }

    return value as T;
  }

  /**
   * Validates and sets a value dynamically
   */
  public set(name: string, value: IKorevelEnvironmentValue): void {
    const prop = this.properties.get(name);

    if (!prop) {
      throw KorevelEnvironmentException.propertyNotDefined(name);
    }

    // Basic Runtime Type Validation
    const actualType = Array.isArray(value) ? "array" : typeof value;
    if (prop.type !== actualType && prop.type !== "object") {
      throw KorevelEnvironmentException.typeMismatch(
        name,
        prop.type,
        actualType,
      );
    }

    this.values.set(name, value);
  }
}
