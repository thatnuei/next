import { action, observable } from "mobx"
import { MessageListModel } from "../message/MessageListModel"

export class ChannelModel {
  constructor(public readonly id: string) {}

  @observable title = ""
  @observable description = ""
  @observable.shallow messageList = new MessageListModel()
  @observable mode: ChannelMode = "both"
  @observable selectedMode: ChannelMode = "both"

  users = new Set<string>()
  ops = new Set<string>()

  @action
  setSelectedMode = (mode: ChannelMode) => {
    this.selectedMode = mode
  }
}

export type ChannelMode = "both" | "chat" | "ads"
