import React from "react"
import { authenticate } from "../flist/api"
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

  componentDidMount() {
    this.setState({ screen: "login" })
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
