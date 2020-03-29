import { action, computed, observable } from "mobx"
import { CharacterStore } from "./CharacterStore"

export class CharacterCollection {
  constructor(private readonly characterStore: CharacterStore) {}

  @observable.shallow
  private _names = new Set<string>()

  @action
  add(name: string) {
    this._names.add(name)
  }

  @action
  delete(name: string) {
    this._names.delete(name)
  }

  @action
  setAll(names: Iterable<string>) {
    this._names = new Set(names)
  }

  @computed
  get names() {
    return this._names.values()
  }

  @computed
  get characters() {
    return [...this._names].map(this.characterStore.getCharacter)
  }
}
