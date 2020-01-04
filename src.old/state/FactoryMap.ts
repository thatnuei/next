import { action, computed, observable } from "mobx"

export default class FactoryMap<T extends object> {
  @observable.shallow
  private items = new Map<string, T>()

  constructor(private createItem: (id: string) => T) {}

  get = (id: string) => {
    const item = this.items.get(id)
    if (item) return item

    const newItem = this.createItem(id)
    this.set(id, newItem)
    return newItem
  }

  @action
  set = (id: string, newItem: T) => {
    this.items.set(id, newItem)
  }

  @action
  update = (id: string, updateFn: (item: T) => T | void) => {
    const item = this.items.get(id) || this.createItem(id)
    const newItem = updateFn(item) || item
    this.items.set(id, newItem)
  }

  @action
  delete = (id: string) => {
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

  @computed
  get entries() {
    return [...this.items.entries()]
  }
}