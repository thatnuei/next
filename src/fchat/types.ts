import * as fchat from "fchat"
import { Values } from "../common/types"

export type ClientCommands = fchat.Connection.ClientCommands
export type ServerCommands = fchat.Connection.ServerCommands

export type ServerCommand = Values<
  { [K in keyof ServerCommands]: { type: K; params: ServerCommands[K] } }
>
