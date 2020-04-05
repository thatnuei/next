import { openDB } from "idb"
import { Validator } from "../validation"

const dbPromise = openDB("keyval-store", 1, {
  upgrade(db) {
    db.createObjectStore("keyval")
  },
})

const keyValueStore = {
  async get(key: string): Promise<unknown> {
    return (await dbPromise).get("keyval", key)
  },
  async set(key: string, val: unknown): Promise<void> {
    await (await dbPromise).put("keyval", val, key)
  },
  async delete(key: string): Promise<void> {
    await (await dbPromise).delete("keyval", key)
  },
  async clear(): Promise<void> {
    await (await dbPromise).clear("keyval")
  },
  async keys(): Promise<IDBValidKey[]> {
    return (await dbPromise).getAllKeys("keyval")
  },
}

export function createStoredValue<V>(key: string, validator: Validator<V>) {
  return {
    get: async (): Promise<V> => validator.parse(await keyValueStore.get(key)),
    set: async (value: V): Promise<void> => keyValueStore.set(key, value),
    delete: (): Promise<void> => keyValueStore.delete(key),
  }
}
