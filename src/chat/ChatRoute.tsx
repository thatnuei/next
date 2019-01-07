import { RouteComponentProps } from "@reach/router"
import React, { useEffect } from "react"
import { useAppStateContext } from "../app/AppStateContainer"

type ChatRouteProps = RouteComponentProps

function ChatRoute(props: ChatRouteProps) {
  const appState = useAppStateContext()

  useEffect(() => {
    const disconnect = appState.connectToChat()
    return disconnect
  }, [])

  return <p>chat</p>
}
export default ChatRoute
