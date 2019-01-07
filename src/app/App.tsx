import { Redirect, Router } from "@reach/router"
import React, { useContext, useEffect, useState } from "react"
import ChatRoute from "../chat/ChatRoute"
import AppStateContainer from "./AppStateContainer"
import CharacterSelectRoute from "./CharacterSelectRoute"
import LoginRoute from "./LoginRoute"
import routePaths from "./routePaths"

function App() {
  const appState = useContext(AppStateContainer.Context)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    init()
  }, [])

  async function init() {
    try {
      await appState.restoreSession()
    } catch (error) {
      console.warn("Session restore error:", error)
    }

    setReady(true)
  }

  if (!ready) {
    return <p>Setting things up...</p>
  }

  return (
    <Router>
      <LoginRoute path={routePaths.login} />
      <CharacterSelectRoute path={routePaths.characterSelect} />
      <ChatRoute path={routePaths.chat} />
      <Redirect from="/" to={appState.user ? routePaths.characterSelect : routePaths.login} />
    </Router>
  )
}

export default App
