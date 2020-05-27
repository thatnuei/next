import React, { useContext, useEffect, useMemo } from "react"
import { ChildrenProps } from "../jsx/types"
import { useStreamListener } from "../state/stream"
import { CommandHandlerMap, createCommandHandler } from "./commandHelpers"
import { useChatCredentials } from "./credentialsContext"
import { SocketHandler } from "./SocketHandler"

const ChatSocketContext = React.createContext(new SocketHandler())

export function ChatSocketProvider({ children }: ChildrenProps) {
  const socket = useMemo(() => new SocketHandler(), [])
  return (
    <ChatSocketContext.Provider value={socket}>
      {children}
    </ChatSocketContext.Provider>
  )
}

export function useChatSocket() {
  return useContext(ChatSocketContext)
}

export function useChatSocketConnection({ onDisconnect = () => {} }) {
  const socket = useChatSocket()
  const creds = useChatCredentials()

  useEffect(() => {
    socket.onDisconnect = onDisconnect
  }, [socket, onDisconnect])

  useEffect(() => {
    socket.connect(creds)
    return () => socket.disconnect()
  }, [creds, socket])
}

export function useChatSocketListener(handlerMap: CommandHandlerMap) {
  const socket = useChatSocket()
  useStreamListener(socket.commandStream, createCommandHandler(handlerMap))
}
