import { observable } from "mobx"
import { ChatCredentials } from "../chat/types"
import { Stream } from "../state/stream"
import {
  ClientCommand,
  createCommandString,
  parseServerCommand,
  ServerCommand,
} from "./commandHelpers"

type ConnectOptions = ChatCredentials & {
  onDisconnect: () => void
}

export type SocketStatus =
  | "idle"
  | "connecting"
  | "identifying"
  | "online"
  | "closed"
  | "error"

export class SocketHandler {
  disconnectStream = new Stream()
  commandStream = new Stream<ServerCommand>()

  @observable status: SocketStatus = "idle"

  private socket?: WebSocket

  connect({ account, ticket, identity, onDisconnect }: ConnectOptions) {
    this.status = "connecting"

    const socket = (this.socket = new WebSocket(`wss://chat.f-list.net/chat2`))

    socket.onopen = () => {
      this.status = "identifying"
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
      this.status = "closed"
      this.socket = undefined
      onDisconnect()
    }

    socket.onerror = () => {
      this.status = "error"
      this.socket = undefined
      onDisconnect()
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
        this.status = "online"
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
