import * as fchat from "fchat"
import { action, computed, observable } from "mobx"
import { ConversationModel } from "../conversation/ConversationModel"
import { MessageModel } from "../message/MessageModel"

export type ChannelMode = fchat.Channel.Mode

export class ChannelModel implements ConversationModel {
  id: string

  @observable
  messages: MessageModel[] = []

  @observable
  title = ""

  @observable
  description = ""

  users = observable.array<string>()

  @observable
  ops = new Map<string, true>()

  @observable
  mode: ChannelMode = "both"

  @observable
  filter: ChannelMode = "both"

  // IDEA: add a property for the joined state, e.g. "left" | "joining" | "joined" | "leaving"
  // so we can render loading spinners in the UI and such

  constructor(id: string) {
    this.id = id
  }

  @action
  addMessage(message: MessageModel) {
    this.messages.push(message)

    while (this.messages.length > 400) {
      this.messages.shift()
    }
  }

  @action
  setUsers(users: string[]) {
    this.users.replace(users)
  }

  @action
  addUser(name: string) {
    this.users.push(name)
  }

  @action
  removeUser(name: string) {
    this.users.remove(name)
  }

  @action
  setFilter(filter: ChannelMode) {
    this.filter = filter
  }

  @computed
  get filteredMessages() {
    if (this.mode !== "both") return this.messages
    if (this.filter === "ads") return this.messages.filter((message) => message.type === "ad")
    if (this.filter === "chat") return this.messages.filter((message) => message.type === "normal")
    return this.messages
  }
}
