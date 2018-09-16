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
    switch (this.props.store.screen) {
      case "setup":
        return "Setting things up..."

      case "login":
        return <LoginScreen onSubmit={this.props.store.handleLoginSubmit} />

      case "characterSelect":
        return (
          <CharacterSelectScreen
            characters={this.props.store.characters}
            onSubmit={this.props.store.handleCharacterSubmit}
          />
        )

      case "chat":
        return "chat"
    }
  }
}
