import { ChannelRoom, Message } from "../channel/types"

export type ChatRoomBase<T extends string> = {
  type: T
  id: string
  title: string
  messages: Message[]
  chatboxInput: string
  isUnread: boolean
}

export type ConsoleRoom = ChatRoomBase<"console">

export type ChatRoom = ConsoleRoom | ChannelRoom
