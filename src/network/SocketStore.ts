import { ClientCommands, ServerCommands } from "./types"

export type CommandListener<T extends keyof ServerCommands> = (params: ServerCommands[T]) => void

export type CommandListenerRecord = { [T in keyof ServerCommands]?: Set<CommandListener<any>> }

export class SocketStore {
  private socket?: WebSocket
  private commandListeners: CommandListenerRecord = {}

  connect(account: string, ticket: string, character: string) {
    const socket = (this.socket = new WebSocket(`wss://chat.f-list.net:9799`))

    socket.onopen = () => {
      console.log("socket open")

      this.sendCommand("IDN", {
        account,
        ticket,
        character,
        cname: "next",
        cversion: "0.1.0",
        method: "ticket",
      })
    }

    socket.onclose = () => {
      console.log("socket closed")

      this.socket = undefined
    }

    socket.onmessage = (message) => {
      const data: string = message.data
      const type = data.slice(0, 3) as keyof ServerCommands
      const params = data.length > 3 ? JSON.parse(data.slice(4)) : {}
      console.log(type, params)

      if (type === "IDN") {
        console.log("identified")
      }

      if (type === "PIN") {
        this.sendCommand("PIN", undefined)
      }

      const listenerSet = this.commandListeners[type]
      for (const listener of listenerSet || []) {
        listener(params)
      }
    }
  }

  sendCommand<K extends keyof ClientCommands>(cmd: K, params: ClientCommands[K]) {
    if (this.socket) {
      this.socket.send(`${cmd} ${JSON.stringify(params)}`)
    }
  }

  addCommandListener<T extends keyof ServerCommands>(command: T, listener: CommandListener<T>) {
    const listeners = this.commandListeners[command]
    if (listeners) {
      listeners.add(listener)
    } else {
      this.commandListeners[command] = new Set([listener])
    }
  }
}

export const socketStore = new SocketStore()
