import { navigate, Redirect, RouteComponentProps } from "@reach/router"
import React, { useContext, useEffect } from "react"
import { useImmer } from "use-immer"
import routePaths from "../app/routePaths"
import { CharacterModel } from "../character/CharacterModel"
import { ClientCommands } from "../fchat/types"
import { Dictionary, OptionalArg } from "../helpers/types"
import SessionContainer from "../session/SessionContainer"
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

function useChatState(account: string, ticket: string, identity: string) {
  const [characters, updateCharacters] = useImmer<Dictionary<CharacterModel>>({})

  useEffect(() => {
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
      navigate(routePaths.login)
    }

    socket.onmessage = ({ data }) => {
      const type = data.slice(0, 3)
      const params = data.length > 3 ? JSON.parse(data.slice(4)) : {}
      const command: ServerCommand = { type, params }

      console.log(command)

      if (command.type === "PIN") {
        sendCommand(socket, "PIN")
      }

      if (command.type === "HLO") {
        console.info(command.params.message)
      }

      if (command.type === "CON") {
        console.info(`There are ${command.params.count} characters in chat`)
      }

      if (command.type === "LIS") {
        updateCharacters((draft) => {
          for (const args of command.params.characters) {
            draft[args[0]] = new CharacterModel(...args)
          }
        })
      }
    }

    return () => {
      socket.onopen = null
      socket.onclose = null
      socket.onmessage = null
      socket.close()
    }
  }, [])

  return { characters }
}

function ChatRoute(props: RouteComponentProps) {
  const session = useContext(SessionContainer.Context)
  const identity = props.location && props.location.state.identity

  if (!session.data || typeof identity !== "string") {
    return <Redirect to={routePaths.login} />
  }

  const { account, ticket } = session.data
  return <ChatView account={account} ticket={ticket} identity={identity} />
}
export default ChatRoute

function ChatView(props: { account: string; ticket: string; identity: string }) {
  const chatState = useChatState(props.account, props.ticket, props.identity)
  return <p>Characters: {Object.values(chatState.characters).length}</p>
}
