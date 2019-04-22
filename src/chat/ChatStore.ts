import { action, observable } from "mobx"
import CharacterCollection from "../character/CharacterCollection"
import { createCommandHandler } from "../fchat/helpers"
import RootStore from "../RootStore"

export default class ChatStore {
  @observable identity = ""
  @observable.shallow friends = new CharacterCollection(
    this.root.characterStore,
  )
  @observable.shallow admins = new CharacterCollection(this.root.characterStore)
  @observable.shallow ignored = new CharacterCollection(
    this.root.characterStore,
  )

  constructor(private root: RootStore) {}

  @action
  setIdentity = (identity: string) => {
    this.identity = identity
  }

  isFriend = (name: string) => this.friends.has(name)
  isAdmin = (name: string) => this.admins.has(name)
  isIgnored = (name: string) => this.ignored.has(name)

  @action
  handleSocketCommand = createCommandHandler({
    FRL: ({ characters }) => {
      this.friends.set(characters)
    },

    ADL: ({ ops }) => {
      this.admins.set(ops)
    },

    IGN: (params) => {
      switch (params.action) {
        case "init":
        case "list":
          this.ignored.set(params.characters)
          break

        case "add":
          this.ignored.add(params.character)
          break

        case "delete":
          this.ignored.remove(params.character)
          break
      }
    },

    RTB: () => {
      // TODO
    },
  })
}
