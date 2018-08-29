import React from "react"
import { fetchJson } from "../network/fetchJson"
import { ClientCommands } from "../network/types"
import { LoginModal, LoginValues } from "./LoginModal"
import { SelectCharacterModal } from "./SelectCharacterModal"

type State = {
  screen: "login" | "selectCharacter"
  account: string
  ticket: string
  userCharacters: string[]
}

export class App extends React.Component<{}, State> {
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

  state: State = {
    screen: "login",
    account: "",
    ticket: "",
    userCharacters: [],
  }

  render() {
    switch (this.state.screen) {
      case "login":
        return <LoginModal onSubmit={this.handleLoginSubmit} />
      case "selectCharacter":
        return <SelectCharacterModal characters={this.state.userCharacters} />
    }
  }

  private handleLoginSubmit = async (values: LoginValues) => {
    type ApiTicketResponse = {
      ticket: string
      characters: string[]
    }

    const getTicketEndpoint = "https://www.f-list.net/json/getApiTicket.php"

    const data: ApiTicketResponse = await fetchJson(getTicketEndpoint, {
      method: "post",
      body: {
        ...values,
        no_friends: true,
        no_bookmarks: true,
      },
    })

    this.setState({
      account: values.account,
      ticket: data.ticket,
      userCharacters: data.characters.sort(),
      screen: "selectCharacter",
    })
  }
}
