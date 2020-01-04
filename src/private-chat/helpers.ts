import { PrivateChat } from "./types"

export function createPrivateChat(partnerName: string): PrivateChat {
  return {
    partnerName,
    partnerTypingStatus: "clear",
    messages: [],
    input: "",
    unread: false,
  }
}
