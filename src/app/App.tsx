import { observer } from "mobx-react-lite"
import React from "react"
import ChatScreen from "../chat/ChatScreen"
import { useRootStore } from "../RootStore"
import CharacterSelectScreen from "./CharacterSelectScreen"
import LoginScreen from "./LoginScreen"

function App() {
  const { viewStore } = useRootStore()

  switch (viewStore.screen) {
    case "setup":
      return <p>Setting things up...</p>

    case "login":
      return <LoginScreen />

    case "characterSelect":
      return <CharacterSelectScreen />

    default:
      return <ChatScreen />
  }
}

export default observer(App)
