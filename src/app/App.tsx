import { Router } from "@reach/router"
import React, { useContext, useEffect, useState } from "react"
import SessionContainer from "../session/SessionContainer"
import CharacterSelectRoute from "./CharacterSelectRoute"
import LoginRoute from "./LoginRoute"

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

  return ready ? <AppRoutes /> : <p>Setting things up...</p>
}
export default App

function AppRoutes() {
  return (
    <Router>
      <LoginRoute default path="login" />
      <CharacterSelectRoute path="character-select" />
    </Router>
  )
}
