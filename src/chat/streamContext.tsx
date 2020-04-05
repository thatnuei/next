import React, { useContext, useMemo } from "react"
import { ChildrenProps } from "../jsx/types"
import { Stream } from "../state/stream"
import { ChatEvent } from "./types"

const ChatStreamContext = React.createContext(new Stream<ChatEvent>())

export function ChatStreamProvider({ children }: ChildrenProps) {
  const stream = useMemo(() => new Stream<ChatEvent>(), [])
  return (
    <ChatStreamContext.Provider value={stream}>
      {children}
    </ChatStreamContext.Provider>
  )
}

export function useChatStream() {
  return useContext(ChatStreamContext)
}
