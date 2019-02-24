import { action } from "mobx"
import RootStore from "../RootStore"
import { chatServerUrl } from "./constants"
import { createCommandHandler, parseCommand } from "./helpers"
import { ClientCommandMap } from "./types"

export default class SocketStore {
  private socket?: WebSocket

  constructor(
    private root: RootStore,
    private createSocket = defaultCreateSocket,
  ) {}

  connectToChat(onConnect: () => void, onDisconnect: () => void) {
    const { account, ticket } = this.root.userStore
    const { identity } = this.root.chatStore

    const socket = (this.socket = this.createSocket(chatServerUrl))

    socket.onopen = () => {
      this.sendSocketCommand("IDN", {
        account,
        ticket,
        character: identity,
        cname: "next",
        cversion: "0.1.0",
        method: "ticket",
      })
    }

    socket.onclose = () => {
      onDisconnect()
    }

    socket.onmessage = ({ data }) => {
      const command = parseCommand(data)

      if (command.type === "IDN") onConnect()

      this.handleSocketCommand(command)
      this.root.characterStore.handleSocketCommand(command)
      this.root.channelStore.handleSocketCommand(command)
    }
  }

  disconnectFromChat() {
    const { socket } = this
    if (socket == null) return

    socket.onopen = null
    socket.onclose = null
    socket.onmessage = null
    socket.close()
  }

  sendSocketCommand<K extends keyof ClientCommandMap>(
    cmd: K,
    params: ClientCommandMap[K],
  ) {
    if (this.socket) {
      if (params) {
        this.socket.send(`${cmd} ${JSON.stringify(params)}`)
      } else {
        this.socket.send(cmd)
      }
    }
  }

  @action
  handleSocketCommand = createCommandHandler({
    IDN: () => {
      // join some test channels
      this.sendSocketCommand("JCH", { channel: "Frontpage" })
      this.sendSocketCommand("JCH", { channel: "Fantasy" })
      this.sendSocketCommand("JCH", { channel: "Femboy" })
      this.sendSocketCommand("JCH", { channel: "Story Driven LFRP" })
      this.sendSocketCommand("JCH", { channel: "Development" })
    },
    HLO: ({ message }) => {
      console.info(message)
    },
    CON: ({ count }) => {
      console.info(`There are ${count} characters in chat`)
    },
    PIN: () => {
      this.sendSocketCommand("PIN", undefined)
    },
  })
}

const defaultCreateSocket = (url: string) => new WebSocket(url)
