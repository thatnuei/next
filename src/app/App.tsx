import { Redirect, Router } from "@reach/router"
import React, { useContext, useEffect, useState } from "react"
import SessionContainer from "../session/SessionContainer"
import CharacterSelectRoute from "./CharacterSelectRoute"
import LoginRoute from "./LoginRoute"

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
      <LoginRoute path="login" />
      <CharacterSelectRoute path="character-select" />
      <Redirect from="/" to={session.isAuthenticated ? "character-select" : "login"} />
    </Router>
  )
}

export default App
