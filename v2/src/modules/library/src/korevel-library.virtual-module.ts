import KorevelLibraryException from "./korevel-library.exception.ts";
import { IKorevelLibraryDependency } from "./korevel-library.interface.ts";

/**
 * Creates a "Virtual Module" that redirects all calls to globalThis with memoization.
 */
export function createKorevelLibraryVirtualModule<T extends object>(
  dependency: IKorevelLibraryDependency,
): T {
  let resolvedLibrary: any = null;

  return new Proxy({} as T, {
    get(target, prop, receiver) {
      // 1. Resolve and cache the library on the first access
      if (!resolvedLibrary) {
        if (typeof dependency.source !== "string") {
          throw KorevelLibraryException.invalidDependencySourcePropertyMissing(
            dependency.name,
          );
        }

        const lib = (globalThis as any)[dependency.source];

        if (!lib) {
          // Use a specialized static error for global lookup failure
          throw KorevelLibraryException.libraryNotAvailableOnGlobal(dependency);
        }
        resolvedLibrary = lib;
      }

      // 2. Access the requested property
      const value = Reflect.get(resolvedLibrary, prop, receiver);

      // 3. Bind functions to preserve 'this' context
      if (typeof value === "function") {
        return value.bind(resolvedLibrary);
      }

      return value;
    },
  });
}
