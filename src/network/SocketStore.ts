import { ClientCommands } from "./types"

export class SocketStore {
  private socket?: WebSocket

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
      const command = data.slice(0, 3)
      const params = data.length > 3 ? JSON.parse(data.slice(4)) : {}
      console.log(command, params)

      if (command === "IDN") {
        console.log("identified")
      }

      if (command === "PIN") {
        this.sendCommand("PIN", undefined)
      }
    }
  }

  sendCommand<K extends keyof ClientCommands>(cmd: K, params: ClientCommands[K]) {
    if (this.socket) {
      this.socket.send(`${cmd} ${JSON.stringify(params)}`)
    }
  }
}

export const socketStore = new SocketStore()
