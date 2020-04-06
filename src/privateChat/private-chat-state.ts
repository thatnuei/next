import { observable } from "mobx"
import { InputModel } from "../form/InputModel"
import { createMessageListState } from "../message/message-list-state"
import { TypingStatus } from "./types"

export type PrivateChatState = ReturnType<typeof createPrivateChatState>

export function createPrivateChatState(partnerName: string) {
  return observable(
    {
      partnerName,
      messageList: createMessageListState(),
      chatInput: new InputModel(""),
      typingStatus: "clear" as TypingStatus,
      isOpen: false,
      isUnread: false,
    },
    {
      typingStatus: observable,
      isOpen: observable,
      isUnread: observable,
    },
  )
}
