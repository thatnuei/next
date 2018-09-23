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
    return this.renderScreen()
  }

  @bind
  private renderScreen() {
    switch (appStore.screen) {
      case "setup":
        return "Setting things up..."

      case "login":
        return <LoginScreen onSubmit={appStore.handleLoginSubmit} />

      case "characterSelect":
        return (
          <CharacterSelectScreen
            characters={appStore.characters}
            selectedCharacter={appStore.identity}
            onSelectedCharacterChange={appStore.setIdentity}
            onSubmit={appStore.handleCharacterSubmit}
          />
        )

      case "connecting":
        return "Connecting..."

      case "chat":
        return <Chat />
    }
  }
}
