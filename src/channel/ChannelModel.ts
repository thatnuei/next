import { observable } from "mobx"
import { MessageListModel } from "../message/MessageListModel"

export class ChannelModel {
  @observable
  title = ""

  @observable
  description = ""

  @observable.shallow
  messages = new MessageListModel()

  @observable.shallow
  users = new Set<string>()

  @observable.shallow
  ops = new Set<string>()

  @observable
  mode: ChannelMode = "both"

  @observable
  selectedMode: ChannelMode = "both"

  constructor(readonly id: string) {}
}

export type ChannelMode = "both" | "chat" | "ads"
