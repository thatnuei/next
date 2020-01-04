import { computed, observable } from "mobx"

export class FactoryMap<T> {
  @observable
  private readonly items = new Map<string, T>()

  constructor(private readonly createNew: (key: string) => T) {}

  set = (key: string, item: T) => {
    this.items.set(key, item)
  }

  get = (key: string): T => this.items.get(key) ?? this.createNew(key)

  update = (key: string, update: (item: T) => void) => {
    const item = this.get(key)
    update(item)
    this.set(key, item)
  }

  @computed
  get values() {
    return [...this.items.values()]
  }
}
