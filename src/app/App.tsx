import { observer } from "mobx-react"
import React from "react"
import { sessionStore } from "../session/SessionStore"
import { appStore } from "./AppStore"
import { LoginModal } from "./LoginModal"
import { SelectCharacterModal } from "./SelectCharacterModal"

@observer
export class App extends React.Component {
  async componentDidMount() {
    try {
      await sessionStore.restoreSession()
      appStore.setScreen("selectCharacter")
    } catch (error) {
      console.warn(error)
      appStore.setScreen("login")
    }
  }

  render() {
    switch (appStore.screen) {
      case "setup":
        return <div>Setting things up...</div>
      case "login":
        return <LoginModal />
      case "selectCharacter":
        return <SelectCharacterModal />
    }
  }
}
