import TypedEmitter from "../state/classes/TypedEmitter"
import { chatServerUrl } from "./constants"
import { parseCommand } from "./helpers"
import { ClientCommandMap, ServerCommand } from "./types"

type SocketEventMap = {
  close: void
  error: void
  command: ServerCommand
}

export default class SocketStore {
  private socket?: WebSocket

  events = new TypedEmitter<SocketEventMap>()

  sendCommand<K extends keyof ClientCommandMap>(
    command: K,
    params: ClientCommandMap[K],
  ) {
    if (!this.socket) return

    const message = params ? `${command} ${JSON.stringify(params)}` : command
    this.socket.send(message)
  }

  connect(account: string, ticket: string, character: string) {
    this.socket = new WebSocket(chatServerUrl)

    this.socket.onopen = () => {
      this.sendCommand("IDN", {
        account,
        ticket,
        character,
        cname: "next",
        cversion: "0.0.1",
        method: "ticket",
      })
    }

    this.socket.onclose = () => {
      this.events.notify("close", undefined)
    }

    this.socket.onerror = () => {
      this.events.notify("error", undefined)
    }

    this.socket.onmessage = ({ data }) => {
      const command = parseCommand(data)

      if (command.type === "PIN") {
        this.sendCommand("PIN", undefined)
      }

      this.events.notify("command", command)
    }
  }

  disconnect() {
    if (!this.socket) return

    this.socket.onopen = null
    this.socket.onclose = null
    this.socket.onerror = null
    this.socket.onmessage = null

    this.socket.close()
    this.socket = undefined
  }
}
