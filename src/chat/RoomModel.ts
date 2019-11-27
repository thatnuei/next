import { action, observable } from "mobx"
import MessageModel from "../message/MessageModel"

export default abstract class RoomModel {
  @observable.ref
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
