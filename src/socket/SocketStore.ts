import { ClientCommands, ServerCommands } from "../fchat/types"

export type CommandListener<T extends keyof ServerCommands> = (params: ServerCommands[T]) => void

export type CommandListenerRecord = { [T in keyof ServerCommands]?: Set<CommandListener<any>> }

export class SocketStore {
  private socket?: WebSocket
  private commandListeners: CommandListenerRecord = {}
  private disconnectListeners = new Set<() => void>()

  connect(account: string, ticket: string, character: string, onSuccess: () => void) {
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
      this.disconnectListeners.forEach((listener) => listener())
    }

    socket.onmessage = (message) => {
      const data: string = message.data
      const type = data.slice(0, 3) as keyof ServerCommands
      const params = data.length > 3 ? JSON.parse(data.slice(4)) : {}

      if (type === "PIN") {
        this.sendCommand("PIN", undefined)
      } else {
        const listenerSet = this.commandListeners[type]
        if (listenerSet) {
          listenerSet.forEach((listener) => listener(params))
        } else {
          console.log(type, params)
        }
      }

      if (type === "IDN") {
        onSuccess()
      }
    }
  }

  sendCommand<K extends keyof ClientCommands>(cmd: K, params: ClientCommands[K]) {
    if (this.socket) {
      if (params) {
        this.socket.send(`${cmd} ${JSON.stringify(params)}`)
      } else {
        this.socket.send(cmd)
      }
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

  addDisconnectListener(listener: () => void) {
    this.disconnectListeners.add(listener)
  }
}
