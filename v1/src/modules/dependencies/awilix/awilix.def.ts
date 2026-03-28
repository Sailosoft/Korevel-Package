export type IKorevelDepAwilixLifetime = "SINGLETON" | "TRANSIENT" | "SCOPED";

type IKorevelDepAwilixInjection = "PROXY" | "CLASSIC";

export interface IKorevelDepAwilixContainerOptions {
  injectionMode?: IKorevelDepAwilixInjection;
  strict?: boolean;
  [key: string]: any;
}

export interface IKorevelDepAwilixRegistrationOptions {
  lifetime?: IKorevelDepAwilixLifetime;
  injector?: (container: any) => any;
  register?: any;
  // Allows for extra library-specific settings without direct imports
  [key: string]: any;
}

// export interface IKorevelDep
export interface IKorevelDepAwilix {
  createContainer: (options?: IKorevelDepAwilixContainerOptions) => any;
  /**
   * Wraps a class for registration
   */
  asClass: (
    definition: any,
    options?: IKorevelDepAwilixRegistrationOptions,
  ) => any;
  /**
   * Wraps a static value for registration
   */
  asValue: (value: any) => any;

  /**
   * Wraps a function/factory for registration
   */
  asFunction: (
    fn: (...args: any[]) => any,
    options?: IKorevelDepAwilixRegistrationOptions,
  ) => any;

  /**
   * Creates an alias to another registration
   */
  aliasTo: (name: string | symbol) => any;
  readonly Lifetime: {
    readonly SINGLETON: "SINGLETON";
    readonly TRANSIENT: "TRANSIENT";
    readonly SCOPED: "SCOPED";
  };
}

/**
 * Represents the core Awilix Container structure.
 * This interface maps directly to the underlying library's capabilities.
 */
export interface IKorevelDepAwilixContainer {
  /**
   * Resolves a dependency and allows for manual construction using the container.
   * Useful for building objects that aren't registered but need injected dependencies.
   */
  build<T>(targetOrResolver: any, opts?: any): T;

  /**
   * The internal cache where resolved singleton/scoped instances are stored.
   */
  cache: Map<string | symbol, any>;

  /**
   * Creates a new child container. Scoped registrations in the parent
   * will be unique to this new scope.
   */
  createScope(): IKorevelDepAwilixContainer;

  /**
   * Calls the .dispose() method on all registered dependencies that support it.
   * Essential for clean shutdowns and resource management.
   */
  dispose(): Promise<void>;

  /**
   * Retrieves the registration object (the resolver) for a given name
   * without resolving the actual instance.
   */
  getRegistration(name: string | symbol): any;

  /**
   * Returns true if a registration exists for the given name.
   */
  hasRegistration(name: string | symbol): boolean;

  /**
   * Returns a string representation of the container's state,
   * useful for debugging registration trees.
   */
  inspect(depth?: number): string;

  /**
   * Scans the file system for modules and registers them automatically
   * based on the provided glob patterns.
   */
  loadModules(globPatterns: string[], opts?: any): any;

  /**
   * The primary method for adding registrations to the container.
   * Accepts an object where keys are names and values are resolvers (asClass, asValue, etc.).
   */
  register(nameAndRegistration: Record<string | symbol, any>): any;

  /**
   * A read-only record of all registered resolvers currently in the container.
   */
  registrations: Record<string | symbol, any>;

  /**
   * Resolves a registration by name. This will trigger instantiation
   * if the dependency hasn't been resolved yet.
   */
  resolve<T = any>(name: string | symbol, opts?: any): T;
}
