import React from "react"
import Chat from "./Chat"
import { ChatStateProvider } from "./chatStateContext"
import { ChatProvider } from "./context"
import { ChatStreamProvider } from "./streamContext"
import { ChatCredentials } from "./types"

type Props = ChatCredentials

function ChatRoot(props: Props) {
  return (
    <ChatStateProvider>
      <ChatStreamProvider>
        <ChatProvider {...props}>
          <Chat />
        </ChatProvider>
      </ChatStreamProvider>
    </ChatStateProvider>
  )
}

export default ChatRoot
