import { observable } from "mobx"
import { ChatState } from "../chat/ChatState"
import { createCommandHandler } from "../chat/commandHelpers"
import { MessageListModel } from "../message/MessageListModel"
import { TypingStatus } from "./types"

export class PrivateChatModel {
  constructor(public readonly partnerName: string) {}

  messageList = new MessageListModel()

  @observable.ref typingStatus: TypingStatus = "clear"
}

export function createPrivateChatCommandHandler(state: ChatState) {
  return createCommandHandler({
    PRI({ character, message }) {
      state.privateChats.update(character, (chat) => {
        chat.messageList.add(character, message, "normal", Date.now())
      })
    },
    TPN({ character, status }) {
      state.privateChats.update(character, (chat) => {
        chat.typingStatus = status
      })
    },
  })
}
