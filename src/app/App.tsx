import { Redirect, RouteComponentProps, Router } from "@reach/router"
import React, { useContext, useEffect, useState } from "react"
import ChatRoute from "../chat/ChatRoute"
import SessionContainer, { SessionData } from "../session/SessionContainer"
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
      <AuthRoute path={routePaths.characterSelect} component={CharacterSelectRoute} />
      <AuthRoute path={routePaths.chat} component={ChatRoute} />
      <Redirect
        from="/"
        to={session.isAuthenticated ? routePaths.characterSelect : routePaths.login}
      />
    </Router>
  )
}

export default App

type AuthRouteProps = RouteComponentProps & {
  component: React.ComponentType<{ sessionData: SessionData } & RouteComponentProps>
}

function AuthRoute(props: AuthRouteProps) {
  const session = useContext(SessionContainer.Context)
  if (!session.data) {
    return <Redirect to={routePaths.login} />
  }

  const { component: Component, ...componentProps } = props
  return <Component {...componentProps} sessionData={session.data} />
}
