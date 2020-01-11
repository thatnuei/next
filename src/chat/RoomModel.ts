import { observable } from "mobx"
import { createMessage } from "../message/helpers"
import { Message } from "../message/types"

export class RoomModel {
  @observable.shallow
  messages: Message[] = []

  static readonly messageLimit = 300

  addMessage = (...args: Parameters<typeof createMessage>) => {
    const message = createMessage(...args)
    this.messages.push(message)

    // limit stored messages to save memory
    this.messages.splice(0, this.messages.length - RoomModel.messageLimit)

    return message
  }

  @observable
  unread = false

  markUnread = () => {
    this.unread = true
  }

  markRead = () => {
    this.unread = false
  }

  @observable
  input = ""

  setInput = (input: string) => {
    this.input = input
  }
}
