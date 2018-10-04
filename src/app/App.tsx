import { bind } from "decko"
import { observer } from "mobx-react"
import React from "react"
import { Chat } from "../chat/Chat"
import { appStore } from "../store"
import { CharacterSelectScreen } from "./CharacterSelectScreen"
import { LoginScreen } from "./LoginScreen"

@observer
export class App extends React.Component {
  render() {
    a
    return this.renderScreen()
  }

  @bind
  private renderScreen() {
    switch (appStore.appRouterStore.route) {
      case "setup":
        return "Setting things up..."

      case "login":
        return <LoginScreen />

      case "characterSelect":
        return <CharacterSelectScreen />

      case "connecting":
        return "Connecting..."

      case "chat":
        return <Chat />
    }
  }
}
