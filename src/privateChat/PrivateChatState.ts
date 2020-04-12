import { observable } from "mobx"
import { InputState } from "../form/InputState"
import { MessageListState } from "../message/MessageListState"
import { TypingStatus } from "./types"

export class PrivateChatState {
  constructor(readonly partnerName: string) {}

  @observable isOpen = false
  @observable isUnread = false
  @observable typingStatus: TypingStatus = "clear"

  messageList = new MessageListState()
  chatInput = new InputState("")
}
