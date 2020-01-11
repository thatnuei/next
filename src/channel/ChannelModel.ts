import { observable } from "mobx"
import { RoomModel } from "../chat/RoomModel"
import { ChannelMode } from "./types"

export class ChannelModel {
  readonly id: string
  @observable name: string
  @observable description = ""
  @observable mode: ChannelMode = "both"
  @observable selectedMode: ChannelMode = "chat"
  @observable users = new Set<string>()
  @observable ops = new Set<string>()

  room = new RoomModel()

  constructor(id: string) {
    this.id = id
    this.name = id
  }
}
