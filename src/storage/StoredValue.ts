import * as idb from "idb-keyval"

export default class StoredValue<V> {
  constructor(private readonly key: string) {}

  get() {
    return idb.get<V | undefined>(this.key)
  }

  set(value: V) {
    return idb.set(this.key, value)
  }
}
