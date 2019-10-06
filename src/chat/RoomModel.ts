import { action, observable } from "mobx"
import MessageModel from "./MessageModel"

export default abstract class RoomModel {
  @observable.shallow
  messages: MessageModel[] = []

  @observable
  unread = false

  @observable
  chatboxInput = ""

  @action
  addMessage(message: MessageModel) {
    this.messages = [...this.messages, message].slice(-300)
  }

  @action
  markRead() {
    this.unread = false
  }

  @action
  markUnread() {
    this.unread = true
  }

  @action
  setChatboxInput = (input: string) => {
    this.chatboxInput = input
  }
}
