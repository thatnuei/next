import * as idb from "idb-keyval"

/**
 *
 * @param keyOrGetKey The key to use for storing the value.
 *
 * When receiving a string, will always use that string as the key.
 *
 * When receiving a function, calls the function with the input to `get()` and `set()`,
 * to get the actual key.
 */
export function createStorageEffect<T>(
  keyOrGetKey: string | ((input: string) => string),
) {
  const getKey = (input: string) =>
    typeof keyOrGetKey === "string" ? keyOrGetKey : keyOrGetKey(input)

  return {
    get(input: string) {
      return idb.get<T | undefined>(getKey(input))
    },
    set(input: string, value: T) {
      return idb.set(getKey(input), value)
    },
  }
}
