import { KorevelException } from "../../exception/index.ts";
import {
  IKorevelTypeString,
  IKorevelEnvironmentValue,
} from "./korevel-environment.interface.ts";

export default class KorevelEnvironmentException extends KorevelException {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, context);
    this.name = "KorevelEnvironmentException";
  }

  /**
   * Raised when a property is accessed but hasn't been defined in the schema
   */
  static propertyNotDefined(name: string): KorevelEnvironmentException {
    return new KorevelEnvironmentException(
      `Property "${name}" is not defined in the environment schema.`,
      {
        hint: "Register this property in the builder using .define() before setting or getting it.",
      },
    );
  }

  /**
   * Raised when a required property is missing during build or access
   */
  static missingRequiredProperty(name: string): KorevelEnvironmentException {
    return new KorevelEnvironmentException(
      `Missing required environment property: "${name}"`,
      { required: true },
    );
  }

  /**
   * Raised when the provided value doesn't match the expected schema type
   */
  static typeMismatch(
    name: string,
    expected: IKorevelTypeString,
    actual: string,
  ): KorevelEnvironmentException {
    return new KorevelEnvironmentException(
      `Type mismatch for environment property "${name}".`,
      {
        expected,
        actual,
        hint: `Check your builder.set("${name}", value) call.`,
      },
    );
  }

  /**
   * Raised if someone tries to modify the environment after the framework has started
   */
  static environmentLocked(): KorevelEnvironmentException {
    return new KorevelEnvironmentException(
      "The environment is locked and cannot be modified.",
      { hint: "Environment variables must be set during the startUp phase." },
    );
  }

  /**
   * Raised when validation logic fails for a specific value
   */
  static invalidValue(
    name: string,
    value: IKorevelEnvironmentValue,
    reason: string,
  ): KorevelEnvironmentException {
    return new KorevelEnvironmentException(
      `Invalid value for "${name}": ${reason}`,
      { value },
    );
  }
}
