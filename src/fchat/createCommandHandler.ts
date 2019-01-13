import { CommandHandlerMap, ServerCommand } from "./types"

export default function createCommandHandler(handlers: CommandHandlerMap) {
  return (command: ServerCommand) => {
    const handler = handlers[command.type]
    if (!handler) return false
    ;(handler as any)(command.params)
    return true
  }
}
