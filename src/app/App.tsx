import { Router } from "@reach/router"
import React, { useContext, useEffect, useState } from "react"
import SessionContainer from "../session/SessionContainer"
import CharacterSelectScreen from "./CharacterSelectScreen"
import LoginScreen from "./LoginScreen"

function App() {
  const session = useContext(SessionContainer.Context)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    restoreSession()
  }, [])

  async function restoreSession() {
    await session.restore()
    setReady(true)
  }

  if (!ready) {
    return <p>Setting things up...</p>
  }

  return (
    <Router>
      <LoginScreen default path="login" />
      <CharacterSelectScreen path="character-select" />
    </Router>
  )
}
export default App
