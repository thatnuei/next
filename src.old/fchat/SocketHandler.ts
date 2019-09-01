import TypedEmitter from "../state/TypedEmitter"
import { chatServerUrl } from "./constants"
import { parseCommand } from "./helpers"
import { ClientCommandMap, ServerCommand } from "./types"

type ConnectOptions = {
  account: string
  ticket: string
  character: string
}

type EventTypes = {
  open: void
  close: void
  command: ServerCommand
}

export default class SocketHandler extends TypedEmitter<EventTypes> {
  private socket?: WebSocket
  // private identity = ""

  connect(options: ConnectOptions) {
    return new Promise<void>((resolve, reject) => {
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
        reject(new Error("Socket closed"))
        this.notify("close", undefined)
      }

      socket.onmessage = ({ data }) => {
        const command = parseCommand(data)

        if (command.type === "IDN") {
          identified = true
          resolve()
        }

        if (command.type === "ERR") {
          const { message, number } = command.params
          console.error(`Socket error (${number}): ${message}`)

          // only reject if we haven't identified
          // if we've identified, the error might not be fatal
          if (!identified) {
            reject(new Error(message))
          }
        }

        this.notify("command", command)
      }

      socket.onerror = () => {
        reject(new Error("Failed to connect"))
      }
    })
  }

  disconnect() {
    if (this.socket == null) return

    this.unbindListeners()
    this.socket.close()
  }

  // TODO: rename to "sendCommand", make private(?)
  send<K extends keyof ClientCommandMap>(cmd: K, params: ClientCommandMap[K]) {
    if (!this.socket) return

    if (params) {
      this.socket.send(`${cmd} ${JSON.stringify(params)}`)
    } else {
      this.socket.send(cmd)
    }
  }

  async waitForCommand() {
    const result = await this.waitForEvent("command")
    return result.value
  }

  async joinChannel(channelId: string, identity: string) {
    this.send("JCH", { channel: channelId })

    while (true) {
      const command = await this.waitForCommand()

      if (command.type === "JCH") {
        const { params } = command

        const isSelf =
          params.channel === channelId && params.character.identity === identity

        if (isSelf) {
          break
        }
      }

      if (command.type === "ERR") {
        const { params } = command

        // https://wiki.f-list.net/F-Chat_Error_Codes
        const joinErrors = [26, 28, 44, 48]
        if (joinErrors.includes(params.number)) {
          throw new Error(params.message)
        }
      }
    }
  }

  async leaveChannel(channelId: string, identity: string) {
    this.send("LCH", { channel: channelId })

    while (true) {
      const command = await this.waitForCommand()

      if (command.type === "LCH") {
        const { params } = command

        const isSelf =
          params.channel === channelId && params.character === identity

        if (isSelf) {
          break
        }
      }

      if (command.type === "ERR") {
        const { params } = command

        // https://wiki.f-list.net/F-Chat_Error_Codes
        const leaveErrors = [49]
        if (leaveErrors.includes(params.number)) {
          throw new Error(params.message)
        }
      }
    }
  }

  private unbindListeners() {
    if (this.socket == null) return
    this.socket.onopen = null
    this.socket.onclose = null
    this.socket.onmessage = null
  }
}
