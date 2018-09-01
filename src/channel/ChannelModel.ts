import { action, observable } from "mobx"
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

  users = observable.array<string>()

  @observable
  ops = new Map<string, true>()

  @observable
  mode: ChannelMode = "both"

  constructor(id: string) {
    this.id = id
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
}
