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

  private handleLoginSubmit = async ({ account, password }: LoginValues) => {
    try {
      const { ticket, characters } = await authenticate(account, password)

      this.setState({
        credentials: { account, ticket },
        characters: characters.sort(),
        screen: "characterSelect",
      })

      storedCredentials.save({ account, ticket })
    } catch (error) {
      alert(error)
    }
  }

  private handleCharacterSubmit = (identity: string) => {
    this.setState({
      identity,
      screen: "chat",
    })
  }

  private async init() {
    try {
      const credentials = await storedCredentials.load()
      if (!credentials) {
        throw new Error("Credentials not found in storage")
      }

      const { characters } = await fetchCharacters(credentials.account, credentials.ticket)

      this.setState({
        credentials,
        characters: characters.sort(),
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
            onSubmit={this.handleCharacterSubmit}
          />
        )

      case "chat":
        return "todo: chat"
    }

    return "screen not found"
  }
}
