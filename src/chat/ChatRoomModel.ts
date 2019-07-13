import { action, observable } from "mobx"
import MessageModel from "../message/MessageModel"

export default abstract class ChatRoomModel {
  @observable.shallow
  messages: MessageModel[] = []

  @observable
  unread = false

  @action
  markRead() {
    this.unread = false
  }

  @action
  markUnread() {
    this.unread = true
  }
}
