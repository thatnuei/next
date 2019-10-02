import { ClientCommandMap, ServerCommand } from "../chat/types"
import TypedEmitter from "../state/classes/TypedEmitter"
import { createStorageEffect } from "../storage/helpers"
import { chatServerUrl } from "./constants"
import { parseCommand } from "./helpers"

export const identityStorage = createStorageEffect<string>(
  (account) => `identity:${account}`,
)

type SocketEventMap = {
  close: void
  error: void
  command: ServerCommand
}

export const socket = (() => {
  let socket: WebSocket | undefined
  const events = new TypedEmitter<SocketEventMap>()

  function sendCommand<K extends keyof ClientCommandMap>(
    command: K,
    params: ClientCommandMap[K],
  ) {
    const message = params ? `${command} ${JSON.stringify(params)}` : command
    socket?.send(message)
  }

  function connect(account: string, ticket: string, character: string) {
    socket = new WebSocket(chatServerUrl)

    socket.onopen = () => {
      sendCommand("IDN", {
        account,
        ticket,
        character,
        cname: "next",
        cversion: "0.0.1",
        method: "ticket",
      })
    }

    socket.onclose = () => {
      events.notify("close", undefined)
    }

    socket.onerror = () => {
      events.notify("error", undefined)
    }

    socket.onmessage = ({ data }) => {
      const command = parseCommand(data)

      if (command.type === "PIN") {
        sendCommand("PIN", undefined)
      }

      events.notify("command", command)
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
  }

  return {
    events,
    sendCommand,
    connect,
    disconnect,
  }
})()
