import React, { useContext, useMemo } from "react"
import { ChatState } from "./ChatState"

const ChatStateContext = React.createContext<ChatState | undefined>(undefined)

export function ChatStateProvider(props: { children: React.ReactNode }) {
  const state = useMemo(() => new ChatState(), [])
  return (
    <ChatStateContext.Provider value={state}>
      {props.children}
    </ChatStateContext.Provider>
  )
}

// for some reason, if we call new ChatState() and try to use it as a default context value,
// our tests crash. circular dep issue? either way, this fallback weirdness makes it work for now
let fallback: ChatState
export function useChatState() {
  const context = useContext(ChatStateContext)
  if (context) return context

  if (!fallback) fallback = new ChatState()
  return fallback
}
