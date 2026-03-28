export interface IKorevelDepDexie {
  /**
   * The constructor to create a new KorevelDepDexie database instance.
   * The base interface for a Dexie database instance.
   * You can extend this interface to declare your tables for strong typing.
   *
   * @example
   * ```
   * interface Person { id?: number; name: string; }
   *
   * interface MyDatabase extends IKorevelDepDexieDb {
   * people: IKorevelDepDexieTable<Person, number>;
   * }
   *
   * const db = new Dexie<MyDatabase>('MyDatabase');
   * ```
   */
  new <T extends IKorevelDepDexieDb = IKorevelDepDexieDb>(
    dbName: string,
    options?: IKorevelDepDexieOptions,
  ): T;

  // Static Properties
  readonly semVer: string;
  readonly version: number;
  readonly addons: Array<(db: IKorevelDepDexieDb) => void>;

  // Static Methods
  exists(dbName: string): Promise<boolean>;
  delete(dbName: string): Promise<void>;
  getDatabaseNames(): Promise<string[]>;

  /**
   * Global transaction management
   */
  transaction<U>(
    mode: "r" | "rw" | "r!" | "rw!",
    tables: string[],
    scope: () => Promise<U> | U,
  ): Promise<U>;

  /**
   * Utilities often used in Dexie apps
   */
  waitFor<U>(promise: Promise<U> | U, timeout?: number): Promise<U>;
  deepClone<T>(obj: T): T;

  // Event system on the static class
  on: IKorevelDepDexieEvents;
}

export interface IKorevelDepDexieOptions {
  addons?: Array<(db: IKorevelDepDexieDb) => void>;
  autoOpen?: boolean;
  indexedDB?: any; // To override with fake-indexeddb for testing
  IDBKeyRange?: any;
}

/**
 * Represents the primary KorevelDepDexie instance
 */
export interface IKorevelDepDexieDb<T = any, Tkey = any> {
  readonly name: string;
  readonly tables: IKorevelDepDexieTable<T, Tkey>[];
  readonly vout: number; // Current version
  /**
   * The current version number of the database.
   * In Dexie, this is an integer (e.g., 1, 2, 10).
   */
  readonly verno: number;

  version(v: number): IKorevelDepDexieVersion;
  table<T, Tkey>(tableName: string): IKorevelDepDexieTable<T, Tkey>;
  open(): Promise<IKorevelDepDexieDb>;
  close(): void;
  delete(): Promise<void>;
  transaction<U>(
    mode: "r" | "r!" | "rw" | "rw!",
    tables: string[],
    scope: () => Promise<U>,
  ): Promise<U>;
  on: IKorevelDepDexieEvents;
}

/**
 * Versioning and Migration logic
 */
export interface IKorevelDepDexieVersion {
  stores(schema: Record<string, string | null>): IKorevelDepDexieVersion;
  upgrade(
    callback: (trans: IKorevelDepDexieTransaction) => Promise<void> | void,
  ): IKorevelDepDexieVersion;
}

/**
 * Table operations (CRUD)
 */
export interface IKorevelDepDexieTable<T = any, Key = any> {
  name: string;
  schema: IKorevelDepDexieTableSchema;

  add(item: T, key?: Key): Promise<Key>;
  bulkAdd(items: readonly T[]): Promise<Key>;
  put(item: T, key?: Key): Promise<Key>;
  bulkPut(items: readonly T[]): Promise<Key>;
  update(key: Key, changes: Partial<T>): Promise<number>;
  delete(key: Key): Promise<void>;
  clear(): Promise<void>;

  get(key: Key): Promise<T | undefined>;
  get(filter: Partial<T>): Promise<T | undefined>;

  toArray(): Promise<T[]>;
  toCollection(): IKorevelDepDexieCollection<T, Key>;
  where(index: string): IKorevelDepDexieWhereClause<T, Key>;
  count(): Promise<number>;
  /**
   * EF Core Style Mapping:
   * Maps table rows to a specific Class constructor.
   */
  mapToClass(constructor: Function): Function;
}

/**
 * Querying and Filtering logic
 */
export interface IKorevelDepDexieCollection<T = any, Key = any> {
  each(callback: (obj: T) => any): Promise<void>;
  toArray(): Promise<T[]>;
  first(): Promise<T | undefined>;
  last(): Promise<T | undefined>;
  count(): Promise<number>;
  limit(n: number): IKorevelDepDexieCollection<T, Key>;
  offset(n: number): IKorevelDepDexieCollection<T, Key>;
  filter(filter: (obj: T) => boolean): IKorevelDepDexieCollection<T, Key>;
  modify(changes: Partial<T> | ((obj: T) => void)): Promise<number>;
  delete(): Promise<number>;
  reverse(): IKorevelDepDexieCollection<T, Key>;
}

export interface IKorevelDepDexieWhereClause<T = any, Key = any> {
  equals(value: any): IKorevelDepDexieCollection<T, Key>;
  above(value: any): IKorevelDepDexieCollection<T, Key>;
  below(value: any): IKorevelDepDexieCollection<T, Key>;
  between(lower: any, upper: any): IKorevelDepDexieCollection<T, Key>;
  startsWith(str: string): IKorevelDepDexieCollection<T, Key>;
  anyOf(values: any[]): IKorevelDepDexieCollection<T, Key>;
}

export interface IKorevelDepDexieTableSchema {
  name: string;
  primKey: IKorevelDepDexieIndexSpec;
  indexes: IKorevelDepDexieIndexSpec[];
  mappedClass: Function;
}

export interface IKorevelDepDexieIndexSpec {
  name: string;
  keyPath: string | string[];
  unique: boolean;
  multi: boolean;
  auto: boolean;
  compound: boolean;
  src: string;
}

export interface IKorevelDepDexieTransaction {
  db: IKorevelDepDexieDb;
  active: boolean;
  mode: string;
  tables: string[];
  abort(): void;
}

export interface IKorevelDepDexieEvents {
  (eventName: "ready", subscriber: () => any, b: boolean): void;
  (eventName: "error", subscriber: (error: any) => any): void;
  (
    eventName: "populate",
    subscriber: (trans: IKorevelDepDexieTransaction) => any,
  ): void;
  (eventName: "blocked", subscriber: (event: Event) => any): void;
}
