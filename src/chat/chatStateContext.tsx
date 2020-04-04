import React, { useContext, useMemo } from "react"
import { ChatState } from "./ChatState"

const ChatStateContext = React.createContext(new ChatState())

export function ChatStateProvider(props: { children: React.ReactNode }) {
  const state = useMemo(() => new ChatState(), [])
  return (
    <ChatStateContext.Provider value={state}>
      {props.children}
    </ChatStateContext.Provider>
  )
}

export function useChatState() {
  return useContext(ChatStateContext)
}
