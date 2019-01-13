import { Redirect, Router } from "@reach/router"
import React, { useContext, useEffect } from "react"
import ChatRoute from "../chat/ChatRoute"
import { fullHeight } from "../ui/helpers"
import AppStore from "./AppStore"
import CharacterSelectRoute from "./CharacterSelectRoute"
import LoginRoute from "./LoginRoute"
import routePaths from "./routePaths"

function App() {
  const { restoreSession, isSessionLoaded, user } = useContext(AppStore.Context)

  useEffect(() => {
    init()
  }, [])

  async function init() {
    try {
      await restoreSession()
    } catch (error) {
      console.warn("Session restore error:", error)
    }
  }

  if (!isSessionLoaded) {
    return <p>Setting things up...</p>
  }

  return (
    <Router css={fullHeight}>
      <LoginRoute path={routePaths.login} />
      <CharacterSelectRoute path={routePaths.characterSelect} />
      <ChatRoute path="/chat/*" />
      <Redirect from="/" to={user ? routePaths.characterSelect : routePaths.login} />
    </Router>
  )
}

export default App
