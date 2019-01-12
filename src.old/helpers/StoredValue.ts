import * as idb from "idb-keyval"

export class StoredValue<T> {
  constructor(private key: string) {}

  async load() {
    try {
      return await idb.get<T | undefined>(this.key)
    } catch (error) {
      console.warn("[StoredValue] Error while loading:", error.message || error)
    }
  }

  async save(value: T) {
    try {
      await idb.set(this.key, value)
    } catch (error) {
      console.warn("[StoredValue] Error while saving:", error.message || error)
    }
  }
}
