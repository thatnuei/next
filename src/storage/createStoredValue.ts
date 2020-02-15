import { del, get, set } from "idb-keyval"

export function createStoredValue<V>(key: string) {
  return {
    get: () => get<V | undefined>(key),
    set: (value: V) => set(key, value),
    clear: () => del(key),
  }
}
