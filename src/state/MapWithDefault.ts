import { observable } from "mobx"

export class MapWithDefault<V, K = string> {
  @observable.shallow
  private items = new Map<K, V>()

  constructor(private getDefault: (key: K) => V) {}

  get(key: K): V {
    return this.items.has(key)
      ? (this.items.get(key) as V)
      : this.getDefault(key)
  }

  set(key: K, value: V) {
    return this.items.set(key, value)
  }

  keys() {
    return this.items.keys()
  }

  values() {
    return this.items.values()
  }

  update(key: K, doUpdate: (value: V) => void) {
    const value = this.get(key)
    doUpdate(value)
    this.set(key, value)
  }

  replace(key: K, doReplace: (value: V) => V) {
    this.items.set(key, doReplace(this.get(key)))
  }
}
