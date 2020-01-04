import { RoomBase, TypingStatus } from "../chat/types"

export type PrivateChat = RoomBase & {
  partnerName: string
  partnerTypingStatus: TypingStatus
}
