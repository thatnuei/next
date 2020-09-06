import { observable } from "micro-observables"
import { autobind } from "../helpers/common/autobind"
import { PubSub } from "../state/pubsub"
import {
  ClientCommand,
  createCommandString,
  parseServerCommand,
  ServerCommand,
} from "./helpers"

type ConnectOptions = {
  account: string
  ticket: string
  identity: string
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
  status = observable<SocketStatus>("idle")
  commands = new PubSub<ServerCommand>()

  private socket?: WebSocket

  constructor() {
    autobind(this)
  }

  private get isOffline() {
    const statuses: SocketStatus[] = ["idle", "closed", "error"]
    return statuses.includes(this.status.get())
  }

  connect({ account, ticket, identity, onDisconnect }: ConnectOptions) {
    if (!this.isOffline) return

    this.status.set("connecting")

    const socket = (this.socket = new WebSocket(`wss://chat.f-list.net/chat2`))

    socket.onopen = () => {
      this.status.set("identifying")
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
      this.status.set("closed")
      this.socket = undefined
      onDisconnect()
    }

    socket.onerror = () => {
      this.status.set("error")
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
        this.status.set("online")
      }

      if (command.type === "ERR") {
        console.warn("Socket error", command.params.message)
      }

      this.commands.publish(command)
    }
  }

  disconnect() {
    if (!this.socket) return

    this.socket.onopen = null
    this.socket.onclose = null
    this.socket.onerror = null
    this.socket.onmessage = null
    this.socket.close()
    this.status.set("idle")
  }

  send(command: ClientCommand) {
    this.socket?.send(createCommandString(command))
  }
}
