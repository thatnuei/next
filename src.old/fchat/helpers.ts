import { sendMessageAction } from "../socket/socketMiddleware"
import { ClientCommandMap, CommandHandlerMap, ServerCommand } from "./types"

export function parseCommand(data: string) {
  const type = data.slice(0, 3)
  const params = data.length > 3 ? JSON.parse(data.slice(4)) : {}
  return { type, params } as ServerCommand
}

export function createCommandHandler(handlers: CommandHandlerMap) {
  return (command: ServerCommand) => {
    const handler = handlers[command.type]
    if (!handler) return false
    ;(handler as any)(command.params)
    return true
  }
}

export function createCommandMessage<K extends keyof ClientCommandMap>(
  command: K,
  params: ClientCommandMap[K],
) {
  return params ? `${command} ${JSON.stringify(params)}` : command
}

export function commandAction<K extends keyof ClientCommandMap>(
  command: K,
  params: ClientCommandMap[K],
) {
  return sendMessageAction(createCommandMessage(command, params))
}
