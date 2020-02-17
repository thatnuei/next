import { Message } from "../message/types"

export type Channel = {
  id: string
  title: string
  description: string
  messages: Message[]
  users: string[]
  mode: ChannelMode
}

export type ChannelMode = "both" | "chat" | "ads"

export function createChannel(id: string): Channel {
  return {
    id,
    title: id,
    description: "",
    messages: [],
    users: [],
    mode: "both",
  }
}
