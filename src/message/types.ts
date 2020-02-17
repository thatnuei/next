import { Character } from "../character/types"

export type Message = {
  key: string
  senderName: string
  sender?: Character
  text: string
  timestamp: number
  type: MessageType
}

export type MessageType = "normal" | "lfrp" | "admin" | "system"
