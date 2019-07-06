import TypedEmitter from "../state/TypedEmitter"
import { chatServerUrl } from "./constants"
import { parseCommand } from "./helpers"
import { ClientCommandMap, ServerCommand, ServerCommandMap } from "./types"

type ConnectOptions = {
  account: string
  ticket: string
  character: string
}

type EventTypes = {
  open: void
  close: void
  command: ServerCommand
} & ServerCommandMap

export default class SocketHandler extends TypedEmitter<EventTypes> {
  private socket?: WebSocket

  connect(options: ConnectOptions) {
    return new Promise((resolve, reject) => {
      let identified = false

      const socket = (this.socket = new WebSocket(chatServerUrl))

      socket.onopen = () => {
        this.send("IDN", {
          ...options,
          cname: "next",
          cversion: "0.1.0",
          method: "ticket",
        })
        this.notify("open", undefined)
      }

      socket.onclose = () => {
        this.unbindListeners()
        reject()
        this.notify("close", undefined)
      }

      socket.onmessage = ({ data }) => {
        const command = parseCommand(data)

        if (command.type === "IDN") {
          identified = true
          resolve()
        }

        // only reject if we haven't identified
        // if we've identified, the error might not be fatal
        if (command.type === "ERR" && !identified) {
          reject(command.params.message)
        }

        this.notify("command", command)
        this.notify(command.type, command.params)
      }
    })
  }

  disconnect() {
    if (this.socket == null) return

    this.unbindListeners()
    this.socket.close()
  }

  send<K extends keyof ClientCommandMap>(cmd: K, params: ClientCommandMap[K]) {
    if (!this.socket) return

    if (params) {
      this.socket.send(`${cmd} ${JSON.stringify(params)}`)
    } else {
      this.socket.send(cmd)
    }
  }

  private unbindListeners() {
    if (this.socket == null) return
    this.socket.onopen = null
    this.socket.onclose = null
    this.socket.onmessage = null
  }
}
