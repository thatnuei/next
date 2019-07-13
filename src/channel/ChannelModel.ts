import { sortBy } from "lodash"
import { action, computed, observable } from "mobx"
import CharacterCollection from "../character/CharacterCollection"
import CharacterModel from "../character/CharacterModel"
import ChatRoomModel from "../chat/ChatRoomModel"
import RootStore from "../RootStore"
import { ChannelMode } from "./types"

export default class ChannelModel extends ChatRoomModel {
  @observable
  name = this.id

  @observable
  description = ""

  @observable
  mode: ChannelMode = "both"

  @observable
  selectedMode: ChannelMode = "chat"

  users = new CharacterCollection(this.root.characterStore)
  ops = new CharacterCollection(this.root.characterStore)

  constructor(private root: RootStore, public id: string) {
    super()
  }

  @action
  setName(name: string) {
    this.name = name
  }

  @action
  setDescription(description: string) {
    this.description = description
  }

  @action
  setMode(mode: ChannelMode) {
    this.mode = mode
  }

  @action
  setSelectedMode(selectedMode: ChannelMode) {
    this.selectedMode = selectedMode
  }

  @computed
  get filteredMessages() {
    if (this.mode !== "both") return this.messages

    return this.messages.filter((msg) => {
      // admin and system messages should always be visible
      if (this.selectedMode === "ads") return msg.type !== "chat"
      if (this.selectedMode === "chat") return msg.type !== "lfrp"
      return true
    })
  }

  @computed
  get sortedUsers() {
    const { characters } = this.users

    const getSortWeight = (char: CharacterModel) => {
      if (this.root.chatStore.isFriend(char.name)) return 0
      if (this.root.chatStore.isAdmin(char.name)) return 1
      if (this.ops.has(char.name)) return 2
      if (char.status === "looking") return 3
      return 4
    }

    return sortBy(characters, getSortWeight, (char) => char.name.toLowerCase())
  }
}
