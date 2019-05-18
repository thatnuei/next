import { observer } from "mobx-react-lite"
import React from "react"
import ChatScreen from "../chat/ChatScreen"
import { useRootStore } from "../RootStore"
import CharacterSelect from "./CharacterSelect"
import Login from "./Login"

function App() {
  const { viewStore } = useRootStore()
  switch (viewStore.screen.name) {
    case "login":
      return <Login />
    case "characterSelect":
      return <CharacterSelect />
    case "chat":
      return <ChatScreen />
  }
}

export default observer(App)
