import React from "react"
import ChatScreen from "../chat/ChatScreen"
import { useAppNavigation } from "./appNavigation"
import CharacterSelect from "./CharacterSelect"
import Login from "./Login"
import useAppDocumentTitle from "./useAppDocumentTitle"

function App() {
  const { screen } = useAppNavigation()

  useAppDocumentTitle()

  switch (screen.name) {
    case "login":
      return <Login />
    case "characterSelect":
      return <CharacterSelect />
    case "chat":
      return <ChatScreen />
  }
}

export default App
