import React from "react"
import { authenticate, fetchCharacters } from "../flist/api"
import { StoredValue } from "../helpers/StoredValue"
import { CharacterSelectScreen } from "./CharacterSelectScreen"
import { LoginScreen, LoginValues } from "./LoginScreen"

type AppScreen = "setup" | "login" | "characterSelect" | "chat"

type AuthCredentials = { account: string; ticket: string }

type AppState = {
  screen: AppScreen
  credentials?: AuthCredentials
  characters: string[]
  identity?: string
}

const storedCredentials = new StoredValue<AuthCredentials>("credentials")

export class App extends React.Component<{}, AppState> {
  state: AppState = {
    screen: "setup",
    characters: [],
  }

  private getStoredIdentity(account: string) {
    return new StoredValue<string>(`${account}:identity`)
  }

  private handleLoginSubmit = async ({ account, password }: LoginValues) => {
    try {
      const { ticket, characters } = await authenticate(account, password)
      const identity = await this.getStoredIdentity(account).load()

      this.setState({
        credentials: { account, ticket },
        characters: characters.sort(),
        identity,
        screen: "characterSelect",
      })

      storedCredentials.save({ account, ticket })
    } catch (error) {
      alert(error)
    }
  }

  private setIdentity = (identity: string) => {
    this.setState({ identity })

    const { credentials } = this.state
    if (!credentials) return

    this.getStoredIdentity(credentials.account).save(identity)
  }

  private showChat = () => {
    this.setState({ screen: "chat" })
  }

  private async init() {
    try {
      const credentials = await storedCredentials.load()
      if (!credentials) {
        throw new Error("Credentials not found in storage")
      }

      const { account, ticket } = credentials
      const { characters } = await fetchCharacters(account, ticket)
      const identity = await this.getStoredIdentity(account).load()

      this.setState({
        credentials,
        characters: characters.sort(),
        identity,
        screen: "characterSelect",
      })
    } catch (error) {
      console.warn("[non-fatal]", error)
      this.setState({ screen: "login" })
    }
  }

  componentDidMount() {
    this.init()
  }

  render() {
    switch (this.state.screen) {
      case "setup":
        return "Setting things up..."

      case "login":
        return <LoginScreen onSubmit={this.handleLoginSubmit} />

      case "characterSelect":
        return (
          <CharacterSelectScreen
            characters={this.state.characters}
            selected={this.state.identity || this.state.characters[0]}
            onChange={this.setIdentity}
            onSubmit={this.showChat}
          />
        )

      case "chat":
        return "todo: chat"
    }

    return "screen not found"
  }
}
