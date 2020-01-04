import * as fchat from "fchat"
import { Values } from "../common/types"

export type ClientCommandMap = fchat.Connection.ClientCommands
export type ServerCommandMap = fchat.Connection.ServerCommands

export type ServerCommand = Values<
  { [K in keyof ServerCommandMap]: { type: K; params: ServerCommandMap[K] } }
>

export type CommandHandler<K extends keyof ServerCommandMap> = (
  params: ServerCommandMap[K],
) => void

export type CommandHandlerMap = {
  [K in keyof ServerCommandMap]?: CommandHandler<K>
}