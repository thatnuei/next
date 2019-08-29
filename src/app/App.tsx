import React from "react"
import ChatScreen from "../chat/ChatScreen"
import { useAppSelector } from "../store"
import CharacterSelect from "./CharacterSelect"
import Login from "./Login"
import useAppDocumentTitle from "./useAppDocumentTitle"

function App() {
  const screen = useAppSelector((state) => state.appView)

  useAppDocumentTitle()

  switch (screen) {
    case "login":
      return <Login />
    case "characterSelect":
      return <CharacterSelect />
    case "chat":
      return <ChatScreen />
  }

  return null
}

export default App
