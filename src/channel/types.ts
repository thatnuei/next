import * as fchat from "fchat"
import { RoomBase } from "../chat/types"

export type Channel = RoomBase & {
  id: string
  name: string
  description: string
  mode: ChannelMode
  selectedMode: ChannelMode
  users: Set<string>
  ops: Set<string>
}

export type ChannelMode = fchat.Channel.Mode

export type MessageType = "chat" | "lfrp" | "admin" | "system"
