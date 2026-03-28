/**
 * Promisify a function that uses callbacks
 * @usage
 * ```typescript
 * import { korevelPromisify } from "./korevel-util.promisify.ts";
 *
 * const randomTask = korevelPromisify((cb: (err: any, res?: string) => void) => {
 *  setTimeout(() => cb(null, "random"), 1000);
 * });
 *
 * const result = await randomTask();
 * ```
 * @param fn Function to promisify
 * @returns Promise that resolves to the result of the function
 */
export function korevelPromisify<T>(
  fn: (cb: (err: any, res?: T) => void) => void,
): Promise<T> {
  return new Promise((resolve, reject) => {
    fn((err, res) => (err ? reject(err) : resolve(res!)));
  });
}
