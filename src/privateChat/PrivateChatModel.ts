import * as fchat from "fchat"
import { observable } from "mobx"
import { MessageModel } from "../message/MessageModel"

export class PrivateChatModel {
  @observable
  partner: string

  @observable
  messages: MessageModel[] = []

  @observable
  typingStatus: fchat.Character.TypingStatus = "clear"

  @observable
  partnerTypingStatus: fchat.Character.TypingStatus = "clear"

  constructor(partner: string) {
    this.partner = partner
  }
}
