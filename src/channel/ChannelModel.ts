import { observable } from "mobx"
import { CharacterCollection } from "../character/CharacterCollection"
import { CharacterStore } from "../character/CharacterStore"
import { MessageListModel } from "../message/MessageListModel"

export class ChannelModel {
  constructor(
    public readonly id: string,
    private readonly characterStore: CharacterStore,
  ) {}

  @observable title = ""
  @observable description = ""
  @observable.shallow messageList = new MessageListModel()
  @observable mode: ChannelMode = "both"
  @observable selectedMode: ChannelMode = "both"

  users = new CharacterCollection(this.characterStore)
  ops = new CharacterCollection(this.characterStore)
}

export type ChannelMode = "both" | "chat" | "ads"
