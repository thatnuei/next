import * as fchat from "fchat"
import { observable } from "mobx"
import { ConversationModel } from "../conversation/ConversationModel"
import { MessageModel } from "../message/MessageModel"

export class PrivateChatModel implements ConversationModel {
  @observable
  messages: MessageModel[] = []

  @observable
  partner: string

  @observable
  typingStatus: fchat.Character.TypingStatus = "clear"

  @observable
  partnerTypingStatus: fchat.Character.TypingStatus = "clear"

  constructor(partner: string) {
    this.partner = partner
  }

  get id() {
    return this.partner
  }
}
