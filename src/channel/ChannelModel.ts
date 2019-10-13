import { sortBy } from "lodash"
import { action, computed, observable } from "mobx"
import CharacterCollection from "../character/CharacterCollection"
import CharacterModel from "../character/CharacterModel"
import RoomModel from "../chat/RoomModel"
import RootStore from "../RootStore"
import { ChannelMode } from "./types"

export type ChannelJoinState = "left" | "joining" | "joined" | "leaving"

export default class ChannelModel extends RoomModel {
  @observable
  name = this.id

  @observable
  description = ""

  @observable
  mode: ChannelMode = "both"

  @observable
  selectedMode: ChannelMode = "chat"

  @observable
  joinState: ChannelJoinState = "left"

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
  get isJoined() {
    return this.joinState === "joined"
  }

  @computed
  get isLoading() {
    return this.joinState === "joining" || this.joinState === "leaving"
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

  @computed
  get isPublic() {
    // public channels are keyed by their name,
    // where private channels will have an id like `ADL-n34r3jd490m` or something
    // there might be some case where a private channel has the same ID and name,
    // but this works for most instances.
    // the proper solution is complicated (fetching from CHA/ORS)
    return this.id === this.name
  }
}
