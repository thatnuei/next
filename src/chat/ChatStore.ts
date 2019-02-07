import { action, observable } from "mobx"
import CharacterCollection from "../character/CharacterCollection"
import RootStore from "../RootStore"

export default class ChatStore {
  @observable identity = ""

  friends = new CharacterCollection(this.root.characterStore)
  ignoreds = new CharacterCollection(this.root.characterStore)
  admins = new CharacterCollection(this.root.characterStore)

  constructor(private root: RootStore) {}

  @action
  setIdentity(identity: string) {
    this.identity = identity
  }
}
