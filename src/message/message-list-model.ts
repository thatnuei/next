import { observable } from "mobx"
import { MessageModel } from "./message-model"

export type MessageListModel = ReturnType<typeof createMessageListModel>

export const maxMessageCount = 100

export function createMessageListModel() {
  const self = observable({
    messages: [] as MessageModel[],
    add(message: MessageModel) {
      self.messages.push(message)
      self.messages.splice(0, self.messages.length - maxMessageCount)
    },
  })
  return self
}
