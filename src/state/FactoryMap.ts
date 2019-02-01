import { action, computed, observable } from "mobx"

export default class FactoryMap<T> {
  @observable.shallow
  private items = new Map<string, T>()

  constructor(private createItem: (id: string) => T) {}

  @action
  get(id: string) {
    const item = this.items.get(id)
    if (item) return item

    const newItem = this.createItem(id)
    this.items.set(id, newItem)
    return newItem
  }

  @action
  set(id: string, newItem: T) {
    this.items.set(id, newItem)
  }

  @action
  update(id: string, updateFn: (item: T) => T | void) {
    const item = this.items.get(id) || this.createItem(id)
    const newItem = updateFn(item) || item
    this.items.set(id, newItem)
  }

  @action
  delete(id: string) {
    this.items.delete(id)
  }

  @computed
  get values() {
    return [...this.items.values()]
  }

  @computed
  get keys() {
    return [...this.items.keys()]
  }
}
