import React, { useContext, useEffect } from "react"
import ChatRoute from "../chat/ChatRoute"
import { Redirect, Route, Switch } from "../router"
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
    <Switch>
      <Route path={routePaths.login} children={<LoginRoute />} />
      <Route path={routePaths.characterSelect} children={<CharacterSelectRoute />} />
      <Route partial path={routePaths.chat} children={<ChatRoute />} />
      <Redirect from="/" to={user ? routePaths.characterSelect : routePaths.login} />
    </Switch>
  )
}

export default App
