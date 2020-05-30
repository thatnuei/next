import * as fchat from "fchat"
import { ValueOf } from "../helpers/common/types"

type CommandUnionFromRecord<T> = ValueOf<
  {
    [K in keyof T]: T[K] extends undefined
      ? { type: K; params?: undefined } // optional params here makes destructuring nicer
      : { type: K; params: T[K] }
  }
>

export type ClientCommandRecord = fchat.Connection.ClientCommands
export type ServerCommandRecord = fchat.Connection.ServerCommands

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

export type CommandHandlerMap = {
  [K in keyof ServerCommandRecord]?: (params: ServerCommandRecord[K]) => void
}

export type CommandHandlerFn = (command: ServerCommand) => boolean

export function createCommandHandler(
  handlers: CommandHandlerMap,
): CommandHandlerFn {
  return function handleCommand(command: ServerCommand) {
    const handler = handlers[command.type]
    handler?.(command.params as never) // lol
    return handler != null
  }
}

export function combineCommandHandlers(
  handlers: CommandHandlerFn[],
): CommandHandlerFn {
  return function handleCommand(command: ServerCommand) {
    const results = handlers.map((handle) => handle(command))
    return results.some((wasHandled) => wasHandled)
  }
}
