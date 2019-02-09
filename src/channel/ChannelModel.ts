import { action, computed, observable } from "mobx"
import CharacterCollection from "../character/CharacterCollection"
import CharacterStore from "../character/CharacterStore"
import MessageModel from "../message/MessageModel"
import { ChannelMode } from "./types"

export default class ChannelModel {
  @observable name = this.id
  @observable description = ""
  @observable mode: ChannelMode = "both"
  @observable selectedMode: ChannelMode = "both"
  @observable.shallow users = new CharacterCollection(this.characterStore)
  @observable.shallow ops = new CharacterCollection(this.characterStore)
  @observable.shallow messages: MessageModel[] = []

  constructor(private characterStore: CharacterStore, public id: string) {}

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

  @action
  addMessage(message: MessageModel) {
    this.messages.push(message)
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
}
