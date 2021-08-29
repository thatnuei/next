import { createSimpleContext } from "../react/createSimpleContext"
import { Emitter } from "../state/emitter"
import { Store } from "../state/store"
import { socketUrl } from "./constants"
import type { ClientCommand, ServerCommand } from "./helpers"
import { parseServerCommand } from "./helpers"

export type SocketCredentials = {
  account: string
  ticket: string
  character: string
}

export type SocketStatus =
  | "initial"
  | "connecting"
  | "identifying"
  | "online"
  | "willReconnect"
  | "closed"

// https://toys.in.newtsin.space/api-docs/#server-closes-connection-after-issuing-an-err-protocol-command
const errorCodesToAvoidReconnection = new Set([
  2, // server is full
  4, // identification failed
  9, // banned
  30, // too many connections
  31, // logging in with same character from another location
  33, // invalid auth method
  39, // timed out
  40, /// kicked
])

export class SocketStore extends Store<{ status: SocketStatus }> {
  readonly commands = new Emitter<ServerCommand>()
  private socket: WebSocket | undefined

  constructor() {
    super({
      status: "initial",
    })
  }

  private get status() {
    return this.state.status
  }

  private set status(status: SocketStatus) {
    this.merge({ status })
  }

  connect(getCredentials: () => Promise<SocketCredentials>) {
    const connectStatuses: SocketStatus[] = [
      "initial",
      "closed",
      "willReconnect",
    ]

    if (!connectStatuses.includes(this.status)) return

    let shouldReconnect = true

    this.socket = new WebSocket(socketUrl)
    this.status = "connecting"

    this.socket.onopen = async () => {
      const credentials = await getCredentials()

      this.status = "identifying"
      this.send({
        type: "IDN",
        params: {
          ...credentials,
          cname: APP_NAME,
          cversion: APP_VERSION,
          method: "ticket",
        },
      })
    }

    this.socket.onmessage = (event) => {
      const data = parseServerCommand(event.data)

      if (data.type === "PIN") {
        this.send({ type: "PIN" })
        return
      }

      if (data.type === "HLO") {
        // eslint-disable-next-line no-console
        console.info(data.params.message)
        return
      }

      if (data.type === "CON") {
        // eslint-disable-next-line no-console
        console.info(`There are ${data.params.count} users in chat`)
        return
      }

      if (data.type === "IDN") {
        this.status = "online"
      }

      if (
        data.type === "ERR" &&
        errorCodesToAvoidReconnection.has(data.params.number)
      ) {
        shouldReconnect = false
      }

      this.commands.emit(data)
    }

    this.socket.onclose = this.socket.onerror = () => {
      this.socket = undefined
      if (shouldReconnect) {
        this.status = "willReconnect"
        setTimeout(() => this.connect(getCredentials), 3000)
      } else {
        this.status = "closed"
      }
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
    this.status = "closed"
  }

  send(command: ClientCommand) {
    this.socket?.send(
      command.params
        ? `${command.type} ${JSON.stringify(command.params)}`
        : command.type,
    )
  }
}

export const {
  Provider: SocketStoreProvider,
  useValue: useSocketStoreContext,
  useOptionalValue: useOptionalSocketStoreContext,
} = createSimpleContext("SocketStore")
