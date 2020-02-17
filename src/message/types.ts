import { Character } from "../character/types"

export type Message = {
  senderName: string
  sender?: Character
  text: string
  timestamp: number
}
