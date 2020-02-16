import { Character } from "../character/types"

export type Message = {
  sender: Character
  text: string
  timestamp: number
}
