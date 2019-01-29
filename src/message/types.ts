import { Character } from "../character/types"

export type MessageType = "chat" | "lfrp" | "admin" | "system"

export type Message = {
  id: string
  type: MessageType
  senderName?: string
  text: string
  time: number
}

export type MessageWithSender = Message & {
  sender?: Character
}
