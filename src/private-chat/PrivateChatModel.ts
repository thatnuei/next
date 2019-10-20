import { observable } from "mobx"
import RoomModel from "../chat/RoomModel"
import { TypingStatus } from "../chat/types"

export default class PrivateChatModel extends RoomModel {
  @observable
  partner: string

  @observable
  partnerTypingStatus: TypingStatus = "clear"

  constructor(partner: string) {
    super()
    this.partner = partner
  }
}
