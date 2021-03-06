import type * as fchat from "fchat"
import type { ValueOf } from "../common/types"

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
    commandString.length > 3
      ? (JSON.parse(commandString.slice(4)) as unknown)
      : undefined

  return { type, params } as ServerCommand
}

export function createCommandString(command: ClientCommand): string {
  return command.params
    ? `${command.type} ${JSON.stringify(command.params)}`
    : command.type
}

export type CommandHandlerMap<This = void> = {
  [K in keyof ServerCommandRecord]?: (
    this: This,
    params: ServerCommandRecord[K],
  ) => void
}

export function matchCommand(
  command: ServerCommand,
  handlers: CommandHandlerMap,
) {
  const handler = handlers[command.type]
  handler?.(command.params as never) // lol
}

export function createCommandHandler(handlers: CommandHandlerMap) {
  return function handleCommand(command: ServerCommand) {
    matchCommand(command, handlers)
  }
}
