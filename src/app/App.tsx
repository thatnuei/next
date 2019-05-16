import { observer } from "mobx-react-lite"
import React from "react"
import ChatScreen from "../chat/ChatScreen"
import { useRootStore } from "../RootStore"
import CharacterSelectModal from "./CharacterSelectModal"
import LoginModal from "./LoginModal"

function App() {
  const { viewStore } = useRootStore()
  switch (viewStore.screen.name) {
    case "login":
      return <LoginModal />
    case "characterSelect":
      return <CharacterSelectModal />
    case "chat":
      return <ChatScreen />
  }
}

export default observer(App)
