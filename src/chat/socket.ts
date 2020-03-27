import { useEffect, useMemo, useRef, useState } from "react"
import {
  ClientCommand,
  createCommandString,
  parseServerCommand,
  ServerCommand,
} from "./commands"

type SocketCredentials = {
  account: string
  ticket: string
  identity: string
}

type SocketListener = (command: ServerCommand) => void

type SocketStatus =
  | "idle"
  | "connecting"
  | "identifying"
  | "online"
  | "closed"
  | "error"

export function useSocket(listener: SocketListener) {
  const [status, setStatus] = useState<SocketStatus>("idle")
  const socketRef = useRef<WebSocket>()
  const listenerRef = useRef<SocketListener>(listener)

  useEffect(() => {
    listenerRef.current = listener
  })

  const state = useMemo(() => ({ status }), [status])

  const actions = useMemo(() => {
    function connect({ account, ticket, identity }: SocketCredentials) {
      setStatus("connecting")

      const socket = (socketRef.current = new WebSocket(
        `wss://chat.f-list.net/chat2`,
      ))

      socket.onopen = () => {
        setStatus("identifying")
        send({
          type: "IDN",
          params: {
            account,
            ticket,
            character: identity,
            cname: "next",
            cversion: "0.0.0",
            method: "ticket",
          },
        })
      }

      socket.onclose = () => {
        setStatus("closed")
        socketRef.current = undefined
      }

      socket.onerror = () => {
        setStatus("error")
        socketRef.current = undefined
      }

      socket.onmessage = ({ data }) => {
        const command = parseServerCommand(data)

        if (command.type === "IDN") {
          setStatus("online")
          console.info(`Successfully identified`)
          return
        }

        if (command.type === "PIN") {
          send({ type: "PIN" })
          return
        }

        if (command.type === "HLO") {
          console.info(command.params.message)
          return
        }

        if (command.type === "CON") {
          console.info(`There are ${command.params.count} users in chat`)
          return
        }

        listenerRef.current(command)
      }
    }

    function disconnect() {
      const socket = socketRef.current
      if (!socket) return

      socket.onopen = null
      socket.onclose = null
      socket.onerror = null
      socket.onmessage = null
      socket.close()
    }

    function send(command: ClientCommand) {
      socketRef.current?.send(createCommandString(command))
    }

    return { connect, disconnect, send }
  }, [])

  return [state, actions] as const
}
