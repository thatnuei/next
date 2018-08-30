import { action, observable } from "mobx"
import React from "react"
import { fetchJson } from "../network/fetchJson"
import { ClientCommands } from "../network/types"
import { LoginModal, LoginValues } from "./LoginModal"
import { SelectCharacterModal } from "./SelectCharacterModal"

type AppScreen = "setup" | "login" | "selectCharacter"

class AppViewState {
  @observable
  account = ""

  @observable
  ticket = ""

  @observable
  characters: string[] = []

  @observable
  screen: AppScreen = "setup"

  @action
  setUserData(account: string, ticket: string, characters: string[]) {
    this.account = account
    this.ticket = ticket
    this.characters = characters
  }

  @action
  setScreen(screen: AppScreen) {
    this.screen = screen
  }
}

class SocketState {
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
        cname: "next",
        cversion: "0.1.0",
        method: "ticket",
      })
    }

    socket.onclose = () => {
      this.socket = undefined
    }

    socket.onmessage = () => {}
  }
}

export class App extends React.Component {
  viewState = new AppViewState()

  componentDidMount() {
    this.init()
  }

  render() {
    switch (this.viewState.screen) {
      case "setup":
        return <div>Setting things up...</div>
      case "login":
        return <LoginModal onSubmit={this.handleLoginSubmit} />
      case "selectCharacter":
        return <SelectCharacterModal characters={this.viewState.characters} />
    }
  }

  private init = async () => {
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

      this.viewState.setUserData(account, ticket, data.characters.sort())
      this.viewState.setScreen("selectCharacter")
    } catch (error) {
      console.warn(error)
      this.viewState.setScreen("login")
    }
  }

  private handleLoginSubmit = async (values: LoginValues) => {
    try {
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

      this.viewState.setUserData(values.account, data.ticket, data.characters.sort())
      this.viewState.setScreen("selectCharacter")

      localStorage.setItem("account", values.account)
      localStorage.setItem("ticket", data.ticket)
    } catch (error) {
      console.error(error)
      alert(error.message || String(error)) // TODO: replace with actual error modal
    }
  }
}
