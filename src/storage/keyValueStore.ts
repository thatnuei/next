import { openDB } from "idb"

const dbPromise = openDB("keyval-store", 1, {
  upgrade(db) {
    db.createObjectStore("keyval")
  },
})

export const keyValueStore = {
  async get(key: string): Promise<unknown> {
    return (await dbPromise).get("keyval", key) as unknown
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
