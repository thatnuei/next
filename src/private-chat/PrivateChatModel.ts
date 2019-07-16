import { observable } from "mobx"
import ChatRoomModel from "../chat/ChatRoomModel"
import { TypingStatus } from "../chat/types"

export class PrivateChatModel extends ChatRoomModel {
  @observable
  partner: string

  @observable
  typingStatus: TypingStatus = "clear"

  @observable
  partnerTypingStatus: TypingStatus = "clear"

  constructor(partner: string) {
    super()
    this.partner = partner
  }
}
