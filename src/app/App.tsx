import React from "react"
import { fetchJson } from "../network/fetchJson"
import { ClientCommands } from "../network/types"
import { LoginModal, LoginValues } from "./LoginModal"
import { SelectCharacterModal } from "./SelectCharacterModal"

type State = {
  screen: "loading" | "login" | "selectCharacter"
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
    screen: "loading",
    account: "",
    ticket: "",
    userCharacters: [],
  }

  async componentDidMount() {
    try {
      const account = localStorage.getItem("account")
      const ticket = localStorage.getItem("ticket")
      if (!account || !ticket) {
        throw new Error("Account or ticket not found in storage")
      }

      const characterListEndpoint = "https://www.f-list.net/json/api/character-list.php"

      type CharacterListResponse = {
        characters: string[]
      }

      const data: CharacterListResponse = await fetchJson(characterListEndpoint, {
        method: "post",
        body: { account, ticket },
      })

      this.setState({
        account,
        ticket,
        userCharacters: data.characters.sort(),
        screen: "selectCharacter",
      })
    } catch (error) {
      console.warn(error)
      this.setState({ screen: "login" })
    }
  }

  render() {
    switch (this.state.screen) {
      case "login":
        return <LoginModal onSubmit={this.handleLoginSubmit} />
      case "selectCharacter":
        return <SelectCharacterModal characters={this.state.userCharacters} />
      case "loading":
        return <div>loading...</div>
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

    localStorage.setItem("account", values.account)
    localStorage.setItem("ticket", data.ticket)
  }
}
