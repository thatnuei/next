import * as fchat from "fchat"
import { ValueOf } from "../common/types"

type CommandUnionFromRecord<T> = ValueOf<
  {
    [K in keyof T]: T[K] extends undefined
      ? { type: K; params?: undefined } // optional params here makes destructuring nicer
      : { type: K; params: T[K] }
  }
>

type ClientCommandRecord = fchat.Connection.ClientCommands
type ServerCommandRecord = fchat.Connection.ServerCommands

export type ClientCommand = CommandUnionFromRecord<ClientCommandRecord>
export type ServerCommand = CommandUnionFromRecord<ServerCommandRecord>

export function parseServerCommand(commandString: string) {
  const type = commandString.slice(0, 3)
  const params =
    commandString.length > 3 ? JSON.parse(commandString.slice(4)) : undefined
  return { type, params } as ServerCommand
}

export function createCommandString(command: ClientCommand): string {
  return command.params
    ? `${command.type} ${JSON.stringify(command.params)}`
    : command.type
}
