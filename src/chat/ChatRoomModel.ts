import { action, observable } from "mobx"
import MessageModel from "../message/MessageModel"

export default abstract class ChatRoomModel {
  @observable.shallow
  messages: MessageModel[] = []

  @observable
  unread = false

  @action
  addMessage(message: MessageModel) {
    this.messages = [...this.messages.slice(-300), message]
  }

  @action
  markRead() {
    this.unread = false
  }

  @action
  markUnread() {
    this.unread = true
  }
}
