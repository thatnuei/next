import { Message } from "../message/types"

export type ChannelState = {
  id: string
  title: string
  description: string
  messages: Message[]
  users: string[]
  mode: ChannelMode
}

export type ChannelMode = "both" | "chat" | "ads"

export function createChannelState(id: string): ChannelState {
  return {
    id,
    title: id,
    description: "",
    messages: [],
    users: [],
    mode: "both",
  }
}
