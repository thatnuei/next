import * as idb from "idb-keyval"

type Storage<T> = {
  get(key: string): Promise<T | undefined>
  set(key: string, value: T): Promise<void>
}

export default class StoredValue<V> {
  static idb = <T>(): Storage<T> => idb

  static session = <T>(): Storage<T> => ({
    async get(key: string) {
      try {
        const value = window.sessionStorage.getItem(key)
        return value ? JSON.parse(value) : undefined
      } catch (error) {
        console.warn(error)
        return undefined
      }
    },

    async set(key: string, value: T) {
      window.sessionStorage.setItem(key, JSON.stringify(value))
    },
  })

  constructor(
    private readonly key: string,
    private readonly storage = StoredValue.idb<V>(),
  ) {}

  get() {
    return this.storage.get(this.key)
  }

  set(value: V) {
    return this.storage.set(this.key, value)
  }
}
