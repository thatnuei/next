import React from "react"
import { ChildrenProps } from "../jsx/types"
import { SocketProvider } from "../socket/socketContext"
import { ChatStateProvider } from "./chatStateContext"
import { ChatCredentialsProvider } from "./credentialsContext"
import { ChatStreamProvider } from "./streamContext"
import { ChatCredentials } from "./types"

type Props = ChatCredentials & ChildrenProps

function ChatContainer(props: Props) {
  return (
    <ChatStateProvider>
      <ChatStreamProvider>
        <ChatCredentialsProvider {...props}>
          <SocketProvider>{props.children}</SocketProvider>
        </ChatCredentialsProvider>
      </ChatStreamProvider>
    </ChatStateProvider>
  )
}

export default ChatContainer
