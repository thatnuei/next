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
  users = new Set<string>()

  @observable
  ops = new Set<string>()

  @observable
  mode: ChannelMode = "both"

  constructor(id: string) {
    this.id = id
  }
}
