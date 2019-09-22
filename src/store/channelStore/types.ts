import * as fchat from "fchat"

export type Channel = {
  id: string
  title: string
  messages: Message[]
  chatboxInput: string
  isUnread: boolean
  description: string
  mode: ChannelMode
  selectedMode: ChannelMode
  memberNames: string[]
  opNames: string[]
  joining: boolean
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
