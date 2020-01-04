import { ListenerGroup } from "../state/classes/ListenerGroup"
import { chatServerUrl } from "./constants"
import { parseCommand } from "./helpers"
import { ClientCommandMap, ServerCommand } from "./types"

type ConnectOptions = {
  account: string
  ticket: string
  identity: string
}

export class SocketStore {
  private socket?: WebSocket
  readonly commandListeners = new ListenerGroup<[ServerCommand]>()
  readonly closeListeners = new ListenerGroup()
  readonly errorListeners = new ListenerGroup()

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

    socket.addEventListener("close", () => {
      this.closeListeners.call()
      removeListeners()
    })

    socket.addEventListener("error", () => {
      this.errorListeners.call()
      removeListeners()
    })

    socket.addEventListener("message", ({ data }) => {
      const command = parseCommand(data)

      if (command.type === "PIN") {
        this.sendCommand("PIN", undefined)
      }

      this.commandListeners.call(command)
    })

    const removeListeners = () => {
      socket.onopen = null
      socket.onclose = null
      socket.onerror = null
      socket.onmessage = null
    }

    return () => {
      removeListeners()
      socket.close()
    }
  }

  // TODO: rename to send
  sendCommand<K extends keyof ClientCommandMap>(
    command: K,
    params: ClientCommandMap[K],
  ) {
    const message = params ? `${command} ${JSON.stringify(params)}` : command
    this.socket?.send(message)
  }
}
