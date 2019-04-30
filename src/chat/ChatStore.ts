import { action, computed, observable } from "mobx"
import CharacterCollection from "../character/CharacterCollection"
import { CharacterStatus } from "../character/types"
import { createCommandHandler } from "../fchat/helpers"
import RootStore from "../RootStore"

export default class ChatStore {
  @observable identity = ""

  friends = new CharacterCollection(this.root.characterStore)
  admins = new CharacterCollection(this.root.characterStore)
  ignored = new CharacterCollection(this.root.characterStore)

  constructor(private root: RootStore) {}

  @action
  setIdentity = (identity: string) => {
    this.identity = identity
  }

  isFriend = (name: string) => this.friends.has(name)
  isAdmin = (name: string) => this.admins.has(name)
  isIgnored = (name: string) => this.ignored.has(name)

  updateStatus = (status: CharacterStatus, statusmsg: string) => {
    this.root.socketStore.sendSocketCommand("STA", { status, statusmsg })
  }

  @computed
  get identityCharacter() {
    return this.root.characterStore.characters.get(this.identity)
  }

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
