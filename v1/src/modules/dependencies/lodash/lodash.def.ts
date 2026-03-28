export interface IKorevelDepLodash {
  // --- ARRAY METHODS ---
  /** Creates an array of elements split into groups the length of size. */
  chunk<T>(array: T[], size?: number): T[][];
  /** Creates an array with all falsey values removed. (false, null, 0, "", undefined, and NaN) */
  compact<T>(array: (T | null | undefined | false | 0 | "")[]): T[];
  /** Creates a slice of array with n elements dropped from the beginning. */
  drop<T>(array: T[], n?: number): T[];
  /** Creates a slice of array with n elements dropped from the end. */
  dropRight<T>(array: T[], n?: number): T[];
  /** Fills elements of array with value from start up to, but not including, end. */
  fill<T>(array: any[], value: T, start?: number, end?: number): T[];
  /** Flattens array a single level deep. */
  flatten<T>(array: T[][]): T[];
  /** Recursively flattens array. */
  flattenDeep<T>(array: any[]): T[];
  /** The inverse of _.toPairs; this method returns an object composed from key-value pairs. */
  fromPairs(pairs: any[][]): object;
  /** Gets the first element of array. */
  head<T>(array: T[]): T | undefined;
  /** Gets the last element of array. */
  last<T>(array: T[]): T | undefined;
  /** Gets the element at index n of array. If n is negative, the nth element from the end is returned. */
  nth<T>(array: T[], n?: number): T | undefined;
  /** Removes all given values from array using SameValueZero for equality comparisons. */
  pull<T>(array: T[], ...values: T[]): T[];
  /** Removes elements from array corresponding to indexes and returns an array of removed elements. */
  pullAt<T>(array: T[], ...indexes: number[]): T[];
  /** Creates a slice of array from start up to, but not including, end. */
  slice<T>(array: T[], start?: number, end?: number): T[];
  /** Creates a duplicate-free version of an array. */
  uniq<T>(array: T[]): T[];
  /** This method is like _.uniq except that it accepts iteratee which is invoked for each element in array. */
  uniqBy<T>(array: T[], iteratee?: string | ((value: T) => any)): T[];
  /** Creates an array of grouped elements, the first of which contains the first elements of the given arrays. */
  zip(...arrays: any[][]): any[][];

  // --- STRING METHODS ---
  /** Converts string to camel case. (e.g. "Foo Bar" -> "fooBar") */
  camelCase(string?: string): string;
  /** Converts the first character of string to upper case and the remaining to lower case. */
  capitalize(string?: string): string;
  /** Checks if string ends with the target string. */
  endsWith(string?: string, target?: string, position?: number): boolean;
  /** Converts string to kebab case. (e.g. "fooBar" -> "foo-bar") */
  kebabCase(string?: string): string;
  /** Converts string to lower case. */
  lowerCase(string?: string): string;
  /** Pads string on the left and right sides if it's shorter than length. */
  pad(string?: string, length?: number, chars?: string): string;
  /** Repeats the given string n times. */
  repeat(string?: string, n?: number): string;
  /** Replaces matches for pattern in string with replacement. */
  replace(
    string: string,
    pattern: RegExp | string,
    replacement: string | ((...args: any[]) => string),
  ): string;
  /** Converts string to snake case. (e.g. "fooBar" -> "foo_bar") */
  snakeCase(string?: string): string;
  /** Splits string by separator. */
  split(string?: string, separator?: RegExp | string, limit?: number): string[];
  /** Converts string to start case. (e.g. "foo_bar" -> "Foo Bar") */
  startCase(string?: string): string;
  /** Checks if string starts with the target string. */
  startsWith(string?: string, target?: string, position?: number): boolean;
  /** Removes leading and trailing whitespace or specified characters from string. */
  trim(string?: string, chars?: string): string;
  /** Truncates string if it's longer than the given maximum string length. */
  truncate(
    string?: string,
    options?: {
      length?: number;
      omission?: string;
      separator?: RegExp | string;
    },
  ): string;
  /** Converts string to upper case. */
  upperCase(string?: string): string;
  /** Splits string into an array of its words. */
  words(string?: string, pattern?: RegExp | string): string[];
}
