import type * as fchat from "fchat"
import type { MessageState } from "../message/MessageState"
import type { RoomState } from "../room/state"

export type TypingStatus = fchat.Character.TypingStatus

export type PrivateChat = {
  readonly partnerName: string
  readonly typingStatus: TypingStatus
  readonly previousMessages?: readonly MessageState[]
} & RoomState
