import { ServerCommand } from "./types"

export function parseCommand(data: string) {
  const type = data.slice(0, 3)
  const params = data.length > 3 ? JSON.parse(data.slice(4)) : {}
  return { type, params } as ServerCommand
}
