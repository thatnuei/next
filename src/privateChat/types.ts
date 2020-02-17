import { Message } from "../message/types"

export type PrivateChat = {
  partnerName: string
  messages: Message[]
}

export function createPrivateChat(partnerName: string): PrivateChat {
  return { partnerName, messages: [] }
}
