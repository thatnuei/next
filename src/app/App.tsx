import React, { useContext, useEffect } from "react"
import { Redirect, Route, Switch } from "react-router"
import ChatRoute from "../chat/ChatRoute"
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
      <Route path={routePaths.login} component={LoginRoute} />
      <Route path={routePaths.characterSelect} component={CharacterSelectRoute} />
      <Route path={routePaths.chat} component={ChatRoute} />
      <Redirect from="/" to={user ? routePaths.characterSelect : routePaths.login} />
    </Switch>
  )
}

export default App
