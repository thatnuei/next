import { AppStore } from "../app/AppStore"
import { ClientCommands, ServerCommands } from "../fchat/types"

export type CommandListener<T extends keyof ServerCommands> = (params: ServerCommands[T]) => void

export type CommandListenerRecord = { [T in keyof ServerCommands]?: Set<CommandListener<any>> }

export class SocketStore {
  socket?: WebSocket

  constructor(private root: AppStore) {}

  connectToChat(account: string, ticket: string, character: string) {
    this.root.chatStore.setIdentity(character)
    this.root.appRouterStore.setRoute("connecting")

    const socket = (this.socket = new WebSocket(`wss://chat.f-list.net:9799`))

    socket.onopen = () => {
      this.sendCommand("IDN", {
        account,
        ticket,
        character,
        cname: "next",
        cversion: "0.1.0",
        method: "ticket",
      })
    }

    socket.onmessage = ({ data }: { data: string }) => {
      const command = data.slice(0, 3) as keyof ServerCommands
      const params = data.length > 3 ? JSON.parse(data.slice(4)) : {}

      if (command === "PIN") {
        this.sendCommand("PIN", undefined)
        return
      }

      if (command === "IDN") {
        this.root.appRouterStore.setRoute("chat")
      }

      this.root.socketEvents.send(command, params)

      // tslint:disable-next-line:no-console
      console.log(command, params)
    }

    socket.onclose = () => {
      alert("Chat connection lost :(")
      this.root.init()
      // TODO: reconnect?
    }
  }

  sendCommand<K extends keyof ClientCommands>(command: K, params: ClientCommands[K]) {
    if (this.socket) {
      if (params) {
        this.socket.send(`${command} ${JSON.stringify(params)}`)
      } else {
        this.socket.send(command)
      }
    }
  }
}
