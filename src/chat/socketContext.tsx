import React, { useContext, useEffect, useMemo } from "react"
import { ChildrenProps } from "../jsx/types"
import { useCommandStream } from "./commandStreamContext"
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

export function useChatSocketConnection() {
  const socket = useChatSocket()
  const stream = useCommandStream()
  const creds = useChatCredentials()

  useEffect(() => {
    socket.listener = stream.send
  }, [socket, stream.send])

  useEffect(() => {
    socket.connect(creds)
    return () => socket.disconnect()
  }, [creds, socket])
}
