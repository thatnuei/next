import * as fchat from "fchat"
import { ChatRoomBase } from "../chat/types"

export type ChannelRoom = ChatRoomBase<"channel"> & {
  description: string
  mode: ChannelMode
  selectedMode: ChannelMode
  memberNames: string[]
  opNames: string[]
}

export type ChannelMode = fchat.Channel.Mode

export type Message = {
  id: string
  time: number
  senderName: string
  text: string
  type: MessageType
}

export type MessageType = "chat" | "lfrp" | "admin" | "system"
