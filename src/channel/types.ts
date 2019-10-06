import * as fchat from "fchat"

export type ChannelMode = fchat.Channel.Mode

export type ChannelBrowserEntry = {
  id: string
  title: string
  userCount: number
  mode?: ChannelMode
}

export type MessageType = "chat" | "lfrp" | "admin" | "system"
