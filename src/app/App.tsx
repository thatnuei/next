import React from "react"
import { fetchJson } from "../network/fetchJson"
import { ClientCommands } from "../network/types"
import { LoginModal, LoginValues } from "./LoginModal"

export class App extends React.Component {
  socket?: WebSocket

  sendCommand = <K extends keyof ClientCommands>(cmd: K, params: ClientCommands[K]) => {
    if (this.socket) {
      this.socket.send(`${cmd} ${JSON.stringify(params)}`)
    }
  }

  connect = (account: string, ticket: string, character: string) => {
    const socket = (this.socket = new WebSocket(`wss://chat.f-list.net:9799`))

    socket.onopen = () => {
      this.sendCommand("IDN", {
        account,
        ticket,
        character,
        cname: "string",
        cversion: "string",
        method: "ticket",
      })
    }

    socket.onclose = () => {
      this.socket = undefined
    }

    socket.onmessage = () => {}
  }

  render() {
    return <LoginModal onSubmit={this.handleLoginSubmit} />
  }

  private handleLoginSubmit = async (values: LoginValues) => {
    const data = await fetchJson("https://www.f-list.net/json/getApiTicket.php", {
      method: "post",
      body: {
        ...values,
        no_characters: true,
        no_friends: true,
        no_bookmarks: true,
      },
    })

    console.log(data)
  }
}
