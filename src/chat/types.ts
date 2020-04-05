import { ValueOf } from "../common/types"
import { Stream } from "../state/stream"

export type ChatCredentials = {
  account: string
  ticket: string
  identity: string
}

type ChatEventMap = {
  "join-channel": { id: string; title?: string }
  "leave-channel": { id: string }
  "open-private-chat": { name: string }
  "close-private-chat": { name: string }
  "open-channel-browser": {}
  "refresh-channel-browser": {}
  "show-status-update": {}
  "submit-status-update": {}
  "send-channel-message": { channelId: string; text: string }
  "send-private-message": { recipientName: string; text: string }
}

export type ChatEvent = ValueOf<
  {
    [K in keyof ChatEventMap]: { type: K } & ChatEventMap[K]
  }
>

export type ChatEventStream = Stream<ChatEvent>
