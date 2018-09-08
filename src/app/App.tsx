import { observer } from "mobx-react"
import React from "react"
import { Chat } from "../chat/Chat"
import { appViewStore } from "./AppViewStore"
import { LoginModal } from "./LoginModal"
import { SelectCharacterModal } from "./SelectCharacterModal"

@observer
export class App extends React.Component {
  render() {
    switch (appViewStore.screen) {
      case "setup":
        return <div>Setting things up...</div>
      case "login":
        return <LoginModal />
      case "selectCharacter":
        return <SelectCharacterModal />
      case "chat":
        return <Chat />
    }
  }
}
