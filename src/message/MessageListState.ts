import { observable } from "mobx"
import { MessageState } from "./MessageState"

export const maxMessageCount = 100

export class MessageListState {
  @observable.shallow
  messages: MessageState[] = []

  add = (message: MessageState) => {
    this.messages.push(message)
    this.messages.splice(0, this.messages.length - maxMessageCount)
  }
}
