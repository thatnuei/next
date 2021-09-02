import { createEmitter } from "../state/emitter"
import { createStore } from "../state/store"
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

export type ChatSocket = ReturnType<typeof createChatSocket>

// https://toys.in.newtsin.space/api-docs/#server-closes-connection-after-issuing-an-err-protocol-command
const errorCodesToAvoidReconnection = new Set([
  2, // server is full
  4, // identification failed
  9, // banned
  30, // too many connections
  31, // logging in with same character from another location
  33, // invalid auth method
  39, // timed out
  40, // kicked
])

export function createChatSocket() {
  const commands = createEmitter<ServerCommand>()
  const status = createStore<SocketStatus>("initial")
  let socket: WebSocket | undefined

  function connect(getCredentials: () => Promise<SocketCredentials>) {
    const connectStatuses: SocketStatus[] = [
      "initial",
      "closed",
      "willReconnect",
    ]

    if (!connectStatuses.includes(status.value)) return

    let shouldReconnect = true

    socket = new WebSocket(socketUrl)
    status.set("connecting")

    socket.onopen = async () => {
      const credentials = await getCredentials()

      status.set("identifying")
      send({
        type: "IDN",
        params: {
          ...credentials,
          cname: APP_NAME,
          cversion: APP_VERSION,
          method: "ticket",
        },
      })
    }

    socket.onmessage = (event) => {
      const data = parseServerCommand(event.data)

      if (data.type === "PIN") {
        send({ type: "PIN" })
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
        status.set("online")
      }

      if (
        data.type === "ERR" &&
        errorCodesToAvoidReconnection.has(data.params.number)
      ) {
        shouldReconnect = false
      }

      commands.emit(data)
    }

    socket.onclose = socket.onerror = () => {
      socket = undefined
      if (shouldReconnect) {
        status.set("willReconnect")
        setTimeout(() => connect(getCredentials), 3000)
      } else {
        status.set("closed")
      }
    }
  }

  function disconnect() {
    if (!socket) return
    socket.onopen = null
    socket.onclose = null
    socket.onerror = null
    socket.onmessage = null
    socket.close()
    socket = undefined
    status.set("closed")
  }

  function send(command: ClientCommand) {
    socket?.send(
      command.params
        ? `${command.type} ${JSON.stringify(command.params)}`
        : command.type,
    )
  }

  return {
    commands,
    status,
    connect,
    disconnect,
    send,
  }
}
