import { chatServerUrl } from "../fchat/constants"
import { ClientCommands, ServerCommands } from "../fchat/types"
import { OptionalArg, Values } from "../helpers/types"

export class SocketHandler {
  private socket?: WebSocket

  connect(options: ConnectOptions) {
    const socket = (this.socket = new WebSocket(chatServerUrl))

    socket.onopen = () => {
      const { account, ticket, character } = options

      this.sendCommand("IDN", {
        account,
        ticket,
        character,
        cname: "next",
        cversion: "0.1.0",
        method: "ticket",
      })
    }

    socket.onmessage = ({ data }) => {
      const type = data.slice(0, 3)
      const params = data.length > 3 ? JSON.parse(data.slice(4)) : {}
      const command: ServerCommand = { type, params }

      if (type === "PIN") {
        this.sendCommand("PIN")
        return
      }

      options.onCommand(command)
    }

    socket.onclose = () => {
      options.onDisconnect()
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.onclose = null
      this.socket.close()
    }
  }

  sendCommand<K extends keyof ClientCommands>(command: K, ...args: OptionalArg<ClientCommands[K]>) {
    const [params] = args
    if (this.socket) {
      if (params) {
        this.socket.send(`${command} ${JSON.stringify(params)}`)
      } else {
        this.socket.send(command)
      }
    }
  }
}

export type ConnectOptions = {
  account: string
  ticket: string
  character: string
  onCommand: (command: ServerCommand) => void
  onDisconnect: () => void
}

export type ServerCommand = Values<
  { [K in keyof ServerCommands]: { type: K; params: ServerCommands[K] } }
>
