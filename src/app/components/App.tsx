import React from "react"
import { useStore } from "../../store"
import Login from "./Login"

function App() {
  const { state } = useStore()

  switch (state.view) {
    case "login":
      return <Login />
    case "characterSelect":
      return <>characterSelect</>
    case "chat":
      return <>chat</>
  }

  return null
}

export default App
