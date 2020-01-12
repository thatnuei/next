import { observable } from "mobx"
import { RoomModel } from "../chat/RoomModel"
import { TypingStatus } from "./types"

export class PrivateChatModel {
  constructor(public readonly partnerName: string) {}

  room = new RoomModel()

  @observable partnerTypingStatus: TypingStatus = "clear"

  setTypingStatus = (status: TypingStatus) => {
    this.partnerTypingStatus = status
  }
}
