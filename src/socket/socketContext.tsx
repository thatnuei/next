import React, { useContext, useEffect, useMemo } from "react"
import { useChatCredentials } from "../chat/credentialsContext"
import { ChildrenProps } from "../jsx/types"
import { useStreamListener } from "../state/stream"
import {
  CommandHandlerFn,
  CommandHandlerMap,
  createCommandHandler,
} from "./commandHelpers"
import { SocketHandler } from "./SocketHandler"

const SocketContext = React.createContext(new SocketHandler())

export function SocketProvider({ children }: ChildrenProps) {
  const socket = useMemo(() => new SocketHandler(), [])
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}

export function useSocket() {
  return useContext(SocketContext)
}

export function useSocketConnection({ onDisconnect = () => {} }) {
  const socket = useSocket()
  const creds = useChatCredentials()

  useEffect(() => {
    socket.onDisconnect = onDisconnect
  }, [socket, onDisconnect])

  useEffect(() => {
    socket.connect(creds)
    return () => socket.disconnect()
  }, [creds, socket])
}

export function useSocketListener(
  handler: CommandHandlerFn | CommandHandlerMap,
) {
  const socket = useSocket()
  useStreamListener(
    socket.commandStream,
    typeof handler === "function" ? handler : createCommandHandler(handler),
  )
}
