import React from "react"
import { ChildrenProps } from "../jsx/types"
import { SocketProvider } from "../socket/socketContext"
import { ChatCredentialsProvider } from "./credentialsContext"
import { ChatStreamProvider } from "./streamContext"
import { ChatCredentials } from "./types"

type Props = ChatCredentials & ChildrenProps

function ChatContainer(props: Props) {
  return (
    <ChatStreamProvider>
      <ChatCredentialsProvider {...props}>
        <SocketProvider>{props.children}</SocketProvider>
      </ChatCredentialsProvider>
    </ChatStreamProvider>
  )
}

export default ChatContainer
