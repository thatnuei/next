import React from "react"
import Chat from "../../chat/components/Chat"
import { useStore } from "../../store"
import CharacterSelect from "./CharacterSelect"
import Login from "./Login"

function App() {
  const { state } = useStore()

  switch (state.view) {
    case "login":
      return <Login />
    case "characterSelect":
      return <CharacterSelect />
    case "chat":
      return <Chat />
  }

  return null
}

export default App
