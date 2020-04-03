import { observable } from "mobx"

export class MapWithDefault<V, K = string> {
  @observable.shallow
  private items = new Map<K, V>()

  constructor(private readonly getDefault: (key: K) => V) {}

  get = (key: K): V =>
    this.items.has(key) ? (this.items.get(key) as V) : this.getDefault(key)

  set(key: K, value: V) {
    this.items.set(key, value)
  }

  delete(key: K) {
    this.items.delete(key)
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
