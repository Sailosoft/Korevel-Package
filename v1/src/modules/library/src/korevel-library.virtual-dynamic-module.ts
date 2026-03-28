import { IKorevelLibraryDependency } from "../index.ts";
import KorevelLibraryException from "./korevel-library.exception.ts";

/**
 * Creates a virtual dynamic module that lazily resolves a library from the global scope.
 * Uses a standard function as the Proxy target to support the 'new' keyword.
 */
export function createKorevelLibraryVirtualDynamicModule<T extends object>(
  dependency: IKorevelLibraryDependency,
): T {
  let resolvedLibrary: any = null;

  const resolve = () => {
    if (resolvedLibrary) return resolvedLibrary;

    // Access the library from globalThis (window, self, or global)
    const lib = (globalThis as any)[dependency.source as string];

    if (!lib) {
      throw KorevelLibraryException.libraryNotAvailableOnGlobal(dependency);
    }

    resolvedLibrary = lib;
    return resolvedLibrary;
  };

  // CRITICAL: Use 'function() {}' instead of '() => {}'
  // Standard functions are "constructable", allowing 'new' to work.
  const dummyTarget = function () {};

  return new Proxy(dummyTarget as any, {
    // Handles: korevelNedb()
    apply(target, thisArg, argumentsList) {
      const lib = resolve();
      return Reflect.apply(lib, thisArg, argumentsList);
    },

    // Handles: new korevelNedb()
    construct(target, args, newTarget) {
      const lib = resolve();
      // We use Reflect.construct to ensure the constructor is called correctly
      return Reflect.construct(lib, args, newTarget);
    },

    // Handles: korevelNedb.someMethod or korevelNedb.someProperty
    get(target, prop, receiver) {
      const lib = resolve();
      const value = Reflect.get(lib, prop, receiver);

      // Bind functions to the library instance to preserve 'this' context
      if (typeof value === "function") {
        return value.bind(lib);
      }

      return value;
    },
  }) as T;
}
