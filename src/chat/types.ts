import { ValueOf } from "../helpers/common/types"
import { Stream } from "../state/stream"

export type ChatCredentials = {
  account: string
  ticket: string
  identity: string
}

type ChatEventMap = {
  "open-private-chat": { name: string }
  "close-private-chat": { name: string }
  "send-private-message": { recipientName: string; text: string }
  "log-out": {}
  "update-ignored": { action: "add" | "delete"; name: string }
  "update-bookmark": { action: "add" | "delete"; name: string }
}

export type ChatEvent = ValueOf<
  {
    [K in keyof ChatEventMap]: { type: K } & ChatEventMap[K]
  }
>

export type ChatEventStream = Stream<ChatEvent>
