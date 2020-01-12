import * as fchat from "fchat"
import { Values } from "../common/types"
import { Message } from "../message/types"

export type ClientCommandMap = fchat.Connection.ClientCommands
export type ServerCommandMap = fchat.Connection.ServerCommands

export type ServerCommand = Values<
  { [K in keyof ServerCommandMap]: { type: K; params: ServerCommandMap[K] } }
>

export type Friendship = {
  us: string
  them: string
}

export type RoomBase = {
  messages: Message[]
  unread: boolean
  input: string
}
