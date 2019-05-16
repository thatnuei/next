import { action, computed, observable } from "mobx"
import CharacterStore from "./CharacterStore"

export default class CharacterCollection {
  @observable.shallow
  private nameSet = new Set<string>()

  constructor(private characterStore: CharacterStore) {}

  @action
  set(names: Iterable<string>) {
    this.nameSet = new Set(names)
  }

  @action
  add(name: string) {
    this.nameSet.add(name)
  }

  @action
  remove(name: string) {
    this.nameSet.delete(name)
  }

  has(name: string) {
    return this.nameSet.has(name)
  }

  @computed
  get names() {
    return [...this.nameSet]
  }

  @computed
  get characters() {
    return this.names.map(this.characterStore.characters.get)
  }

  @computed
  get size() {
    return this.nameSet.size
  }
}
