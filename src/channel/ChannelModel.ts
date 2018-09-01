import { observable } from "mobx"
import { MessageModel } from "../message/MessageModel"

type ChannelMode = "chat" | "ads" | "both"

export class ChannelModel {
  id: string

  @observable
  title = ""

  @observable
  description = ""

  @observable
  messages: MessageModel[] = []

  @observable
  users = new Map<string, true>()

  @observable
  ops = new Map<string, true>()

  @observable
  mode: ChannelMode = "both"

  constructor(id: string) {
    this.id = id
  }
}
