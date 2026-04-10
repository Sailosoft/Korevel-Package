/**
 * The constructor and static entry point for NeDB
 */
export interface IKorevelDepNedb {
  /**
   * Creates a new Datastore (equivalent to a Dexie Table/Database)
   * * @example
   * const db = new Nedb({ filename: 'path/to/datafile', autoload: true });
   */
  new <T = any>(options?: IKorevelDepNedbOptions): IKorevelDepNedbDatastore<T>;

  // Static utility if using as a singleton manager
  Datastore: IKorevelDepNedb;
}

export interface IKorevelDepNedbOptions {
  filename?: string; // Path to the file (Node) or Key (Browser)
  autoload?: boolean; // Load database immediately
  onload?: (error: Error | null) => void;
  inMemoryOnly?: boolean; // Use as a volatile store
  timestampData?: boolean; // Adds updatedAt and createdAt fields automatically
  compareStrings?: (a: string, b: string) => number; // Custom string comparison
}

/**
 * Represents a single NeDB collection/datastore
 */
export interface IKorevelDepNedbDatastore<T = any> {
  // Persistence
  persistence: {
    compactDatafile(): void;
    setAutocompactionInterval(interval: number): void;
    stopAutocompaction(): void;
  };

  // CRUD Operations
  loadDatabase(callback?: (err: Error | null) => void): void;

  insert<U extends T>(
    doc: U,
    callback?: (err: Error | null, document: U) => void,
  ): void;
  insert<U extends T>(
    docs: U[],
    callback?: (err: Error | null, documents: U[]) => void,
  ): void;

  find<U extends T>(query: any): IKorevelDepNedbCursor<U>;
  find<U extends T>(
    query: any,
    callback: (err: Error | null, documents: U[]) => void,
  ): void;

  findOne<U extends T>(
    query: any,
    callback: (err: Error | null, document: U) => void,
  ): void;

  update<U extends T>(
    query: any,
    update: any,
    options?: IKorevelDepNedbUpdateOptions,
    callback?: (
      err: Error | null,
      numberOfUpdated: number,
      upsert?: boolean,
    ) => void,
  ): void;

  remove(
    query: any,
    options?: { multi?: boolean },
    callback?: (err: Error | null, n: number) => void,
  ): void;

  count(query: any, callback: (err: Error | null, count: number) => void): void;

  // Indexing
  ensureIndex(
    options: IKorevelDepNedbIndexOptions,
    callback?: (err: Error | null) => void,
  ): void;
  removeIndex(fieldName: string, callback?: (err: Error | null) => void): void;
}

/**
 * NeDB Cursor for advanced querying (Sort, Skip, Limit)
 */
export interface IKorevelDepNedbCursor<T> {
  sort(query: any): IKorevelDepNedbCursor<T>;
  skip(n: number): IKorevelDepNedbCursor<T>;
  limit(n: number): IKorevelDepNedbCursor<T>;
  projection(query: any): IKorevelDepNedbCursor<T>;
  exec(callback: (err: Error | null, documents: T[]) => void): void;
}

export interface IKorevelDepNedbUpdateOptions {
  multi?: boolean; // Update multiple documents
  upsert?: boolean; // Create document if it doesn't exist
  returnUpdatedDocs?: boolean; // Return the docs after update (NeDB specific)
}

export interface IKorevelDepNedbIndexOptions {
  fieldName: string;
  unique?: boolean;
  sparse?: boolean;
  expireAfterSeconds?: number; // TTL index
}
