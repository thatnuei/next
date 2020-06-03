import { ChatCredentials } from "../chat/types"
import { Stream } from "../state/stream"
import {
  ClientCommand,
  createCommandString,
  parseServerCommand,
  ServerCommand,
} from "./commandHelpers"

export type SocketStatus =
  | "idle"
  | "connecting"
  | "identifying"
  | "online"
  | "closed"
  | "error"

export class SocketHandler {
  commandStream = new Stream<ServerCommand>()
  statusStream = new Stream<SocketStatus>()

  onDisconnect = () => {}

  private socket?: WebSocket

  connect({ account, ticket, identity }: ChatCredentials) {
    this.statusStream.send("connecting")

    const socket = (this.socket = new WebSocket(`wss://chat.f-list.net/chat2`))

    socket.onopen = () => {
      this.statusStream.send("identifying")
      this.send({
        type: "IDN",
        params: {
          account,
          ticket,
          character: identity,
          cname: "next",
          cversion: "0.0.0",
          method: "ticket",
        },
      })
    }

    socket.onclose = () => {
      this.statusStream.send("closed")
      this.socket = undefined
      this.onDisconnect()
    }

    socket.onerror = () => {
      this.statusStream.send("error")
      this.socket = undefined
      this.onDisconnect()
    }

    socket.onmessage = ({ data }) => {
      const command = parseServerCommand(data)

      if (command.type === "PIN") {
        this.send({ type: "PIN" })
        return
      }

      if (command.type === "HLO") {
        console.info(command.params.message)
        return
      }

      if (command.type === "CON") {
        console.info(`There are ${command.params.count} users in chat`)
        return
      }

      if (command.type === "IDN") {
        this.statusStream.send("online")
      }

      if (command.type === "ERR") {
        console.warn("Socket error", command.params.message)
      }

      this.commandStream.send(command)
    }
  }

  disconnect() {
    if (!this.socket) return

    this.socket.onopen = null
    this.socket.onclose = null
    this.socket.onerror = null
    this.socket.onmessage = null
    this.socket.close()
  }

  send(command: ClientCommand) {
    this.socket?.send(createCommandString(command))
  }
}
