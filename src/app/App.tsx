import { observer } from "mobx-react"
import React from "react"
import { AppStore } from "./AppStore"
import { CharacterSelectScreen } from "./CharacterSelectScreen"
import { LoginScreen } from "./LoginScreen"

type Props = {
  store: AppStore
}

@observer
export class App extends React.Component<Props> {
  render() {
    return this.renderScreen()
  }

  private renderScreen() {
    const { store } = this.props
    switch (store.screen) {
      case "setup":
        return "Setting things up..."

      case "login":
        return <LoginScreen onSubmit={store.handleLoginSubmit} />

      case "characterSelect":
        return (
          <CharacterSelectScreen
            characters={store.characters}
            selectedCharacter={store.identity}
            onSelectedCharacterChange={store.setIdentity}
            onSubmit={store.handleCharacterSubmit}
          />
        )

      case "chat":
        return "chat"
    }
  }
}
