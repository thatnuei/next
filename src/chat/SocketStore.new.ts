import { chatServerUrl } from "./constants"
import { parseCommand } from "./helpers"
import { ClientCommandMap, ServerCommand } from "./types"

type ConnectOptions = {
  account: string
  ticket: string
  identity: string
}

type CommandListener = (command: ServerCommand) => void

export class SocketStore {
  private socket?: WebSocket
  private listeners = new Set<CommandListener>()

  connect = (options: ConnectOptions) => {
    const socket = (this.socket = new WebSocket(chatServerUrl))

    socket.addEventListener("open", () => {
      const { account, ticket, identity } = options
      this.sendCommand("IDN", {
        account,
        ticket,
        character: identity,
        cname: "next",
        cversion: "0.0.1",
        method: "ticket",
      })
    })

    socket.addEventListener("close", () => {})
    socket.addEventListener("error", () => {})

    socket.addEventListener("message", ({ data }) => {
      const command = parseCommand(data)

      if (command.type === "PIN") {
        this.sendCommand("PIN", undefined)
      }

      this.listeners.forEach((handle) => handle(command))
    })

    return () => {
      socket.onopen = null
      socket.onclose = null
      socket.onerror = null
      socket.onmessage = null
      socket.close()
    }
  }

  // TODO: rename to send
  sendCommand<K extends keyof ClientCommandMap>(
    command: K,
    params: ClientCommandMap[K],
  ) {
    if (!this.socket) return

    const message = params ? `${command} ${JSON.stringify(params)}` : command
    this.socket.send(message)
  }

  listen = (listener: CommandListener) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }
}
