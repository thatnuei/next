import { ServerCommand, ServerCommandMap } from "./types"

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

type CommandHandler<K extends keyof ServerCommandMap> = (
  params: ServerCommandMap[K],
) => void

type CommandHandlerMap = {
  [K in keyof ServerCommandMap]?: CommandHandler<K>
}
