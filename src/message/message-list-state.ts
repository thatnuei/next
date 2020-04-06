import { observable } from "mobx"
import { MessageState } from "./message-state"

export type MessageListState = ReturnType<typeof createMessageListState>

export const maxMessageCount = 100

export function createMessageListState() {
  const self = observable({
    messages: [] as MessageState[],
    add(message: MessageState) {
      self.messages.push(message)
      self.messages.splice(0, self.messages.length - maxMessageCount)
    },
  })
  return self
}
