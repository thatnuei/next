import { MessageModel } from "../message/MessageModel"

export type PrivateChat = {
  partnerName: string
  messages: MessageModel[]
}

export function createPrivateChat(partnerName: string): PrivateChat {
  return { partnerName, messages: [] }
}
