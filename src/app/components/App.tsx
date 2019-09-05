import React from "react"
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
      return <>chat</>
  }

  return null
}

export default App
