import { navigate, RouteComponentProps } from "@reach/router"
import React, { useContext, useEffect } from "react"
import routePaths from "../app/routePaths"
import { ClientCommands } from "../fchat/types"
import { OptionalArg } from "../helpers/types"
import SessionContainer, { SessionData } from "../session/SessionContainer"
import { ServerCommand } from "../socket/SocketHandler"

function sendCommand<K extends keyof ClientCommands>(
  socket: WebSocket,
  command: K,
  ...params: OptionalArg<ClientCommands[K]>
) {
  if (params[0]) {
    socket.send(`${command} ${JSON.stringify(params[0])}`)
  } else {
    socket.send(command)
  }
}

function ChatRoute(props: RouteComponentProps) {
  const session = useContext(SessionContainer.Context)

  useEffect(() => {
    if (!session.data) {
      navigate(routePaths.login)
      return
    }

    const { account, ticket } = session.data
    const identity = props.location && (props.location.state.identity as string)
    if (!identity) {
      navigate(routePaths.characterSelect)
      return
    }

    const socket = new WebSocket(`wss://chat.f-list.net:9799`)

    socket.onopen = () => {
      sendCommand(socket, "IDN", {
        account,
        ticket,
        character: identity,
        cname: "next",
        cversion: "0.1.0",
        method: "ticket",
      })
    }

    socket.onclose = () => {
      console.log("socket closed")
    }

    socket.onmessage = ({ data }) => {
      const type = data.slice(0, 3)
      const params = data.length > 3 ? JSON.parse(data.slice(4)) : {}
      const command: ServerCommand = { type, params }

      console.log(command)

      if (type === "PIN") {
        sendCommand(socket, "PIN")
        return
      }
    }

    return () => socket.close()
  }, [])

  return <p>{props.location && props.location.state.character}</p>
}
export default ChatRoute

function View(props: { sessionData: SessionData }) {}
