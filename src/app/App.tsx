import { Redirect, Router } from "@reach/router"
import React, { useContext, useEffect, useState } from "react"
import SessionContainer from "../session/SessionContainer"
import CharacterSelectRoute from "./CharacterSelectRoute"
import LoginRoute from "./LoginRoute"
import routePaths from "./routePaths"

function App() {
  const session = useContext(SessionContainer.Context)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    init()
  }, [])

  async function init() {
    try {
      await session.restore()
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
      <Redirect
        from="/"
        to={session.isAuthenticated ? routePaths.characterSelect : routePaths.login}
      />
    </Router>
  )
}

export default App
