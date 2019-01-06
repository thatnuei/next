import { navigate, RouteComponentProps } from "@reach/router"
import { fromPairs } from "lodash"
import React, { useContext, useEffect, useState } from "react"
import routePaths from "../app/routePaths"
import { CharacterModel } from "../character/CharacterModel"
import { ClientCommands } from "../fchat/types"
import { tuple } from "../helpers/tuple"
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

function useDictionary<V>(initialValues: Record<string, V> = {}) {
  const [values, setValues] = useState<Record<string, V>>()
  return tuple(values, {})
}

function ChatRoute(props: RouteComponentProps) {
  const session = useContext(SessionContainer.Context)

  const [characterCount, setCharacterCount] = useState(0)
  const [characters, setCharacters] = useState<Record<string, CharacterModel | undefined>>({})

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

      if (command.type === "PIN") {
        sendCommand(socket, "PIN")
      }

      if (command.type === "CON") {
        setCharacterCount(command.params.count)
      }

      if (command.type === "LIS") {
        const characterPairs = command.params.characters.map(([name, ...args]) =>
          tuple(name, new CharacterModel(name, ...args)),
        )

        setCharacters((prev) => ({
          ...prev,
          ...fromPairs(characterPairs),
        }))
      }
    }

    return () => socket.close()
  }, [])

  return <p>{Object.keys(characters).length}</p>
}
export default ChatRoute

function View(props: { sessionData: SessionData }) {}
