import * as fchat from "fchat"
import { observable } from "mobx"
import ChatRoomModel from "../chat/ChatRoomModel"

export class PrivateChatModel extends ChatRoomModel {
  @observable
  partner: string

  @observable
  typingStatus: fchat.Character.TypingStatus = "clear"

  @observable
  partnerTypingStatus: fchat.Character.TypingStatus = "clear"

  constructor(partner: string) {
    super()
    this.partner = partner
  }
}
