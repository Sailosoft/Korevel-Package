import { KorevelException } from "../../exception/index.ts";
import { IKorevelLibraryDependency } from "../index.ts";

export default class KorevelLibraryException extends KorevelException {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, context);
    this.name = "KorevelLibraryException";
  }

  static libraryNotFound(libraryName: string): KorevelLibraryException {
    return new KorevelLibraryException(`Library "${libraryName}" not found.`);
  }

  static existingLibrary(name: string): KorevelLibraryException {
    return new KorevelLibraryException(
      `Library with name "${name}" already exists.`,
    );
  }

  static libraryNotFoundInStore(name: string): KorevelLibraryException {
    return new KorevelLibraryException(
      `Library with name "${name}" not found in store.`,
    );
  }

  static invalidDependencySourcePropertyMissing(
    name: string,
  ): KorevelLibraryException {
    return new KorevelLibraryException(
      `Invalid library dependency: "source" property is missing or not a string. Dependency: ${name}`,
    );
  }

  /**
   * New: Specific error for when the globalThis lookup fails
   */
  static libraryNotAvailableOnGlobal(
    dep: IKorevelLibraryDependency,
  ): KorevelLibraryException {
    return new KorevelLibraryException(
      `Module "${dep.source}" is not available on globalThis.`,
      {
        cdn: dep.cdn,
        source: dep.source,
        hint: "Ensure the CDN script is loaded before this module is accessed.",
      },
    );
  }
}
