import { bind } from "decko"
import { action, observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { authenticate, fetchCharacters } from "../flist/api"
import { assertDefined } from "../helpers/assertDefined"
import { CharacterSelectScreen } from "./CharacterSelectScreen"
import { LoginScreen, LoginValues } from "./LoginScreen"

type AppScreen = "setup" | "login" | "characterSelect" | "chat"

@observer
export class App extends React.Component {
  @observable
  screen: AppScreen = "setup"

  @observable
  account = ""

  @observable
  ticket = ""

  @observable
  characters: string[] = []

  @observable
  identity = ""

  socket?: WebSocket

  componentDidMount() {
    this.init()
  }

  render() {
    return this.renderScreen()
  }

  private renderScreen() {
    switch (this.screen) {
      case "setup":
        return "Setting things up..."
      case "login":
        return <LoginScreen onSubmit={this.handleLoginSubmit} />
      case "characterSelect":
        return (
          <CharacterSelectScreen
            characters={this.characters}
            onSubmit={this.handleCharacterSubmit}
          />
        )
      case "chat":
        return "chat"
    }
  }

  private async init() {
    try {
      this.restoreAuthData()
      await this.fetchCharacters()
      this.setScreen("characterSelect")
    } catch (error) {
      console.warn("non-fatal:", error)
      this.setScreen("login")
    }
  }

  @bind
  private async handleLoginSubmit({ account, password }: LoginValues) {
    try {
      const { ticket, characters } = await authenticate(account, password)
      this.setAuthData(account, ticket)
      this.setCharacters(characters)
      this.setScreen("characterSelect")
      this.saveAuthData()
    } catch (error) {
      alert(error)
    }
  }

  private handleCharacterSubmit(character: string) {
    this.setIdentity(character)
    this.connectToChat()
  }

  @bind
  private connectToChat() {
    const socket = (this.socket = new WebSocket(`wss://chat.f-list.net:9799`))

    socket.onopen = () => {
      this.sendCommand("IDN", {
        account: this.account,
        ticket: this.ticket,
        character: this.identity,
        cname: "next",
        cversion: "0.1.0",
        method: "ticket",
      })
    }

    socket.onmessage = ({ data }: { data: string }) => {
      const command = data.slice(0, 3)
      const params = data.length > 3 ? JSON.parse(data.slice(4)) : {}

      if (command === "PIN") {
        this.sendCommand("PIN")
        return
      }

      if (command === "IDN") {
        this.setScreen("chat")
        return
      }

      console.log(command, params) // TODO: send command to stores
    }

    socket.onclose = () => {
      alert("Chat connection lost :(")
      this.init()
      // TODO: reconnect?
    }
  }

  private sendCommand(command: string, params?: object) {
    if (this.socket) {
      if (params) {
        this.socket.send(`${command} ${JSON.stringify(params)}`)
      } else {
        this.socket.send(command)
      }
    }
  }

  @action
  private setAuthData(account: string, ticket: string) {
    this.account = account
    this.ticket = ticket
  }

  @action
  private setScreen(screen: AppScreen) {
    this.screen = screen
  }

  @action
  private setCharacters(characters: string[]) {
    this.characters = characters
  }

  @action
  private setIdentity(identity: string) {
    this.identity = identity
  }

  private async fetchCharacters() {
    const { characters } = await fetchCharacters(this.account, this.ticket)
    this.setCharacters(characters)
  }

  @action
  private restoreAuthData() {
    this.account = assertDefined(localStorage.getItem("account"), "Account not found")
    this.ticket = assertDefined(localStorage.getItem("ticket"), "Ticket not found")
  }

  private saveAuthData() {
    localStorage.setItem("account", this.account)
    localStorage.setItem("ticket", this.ticket)
  }
}
