import React from "react"
import { ChildrenProps } from "../jsx/types"
import { ChatStateProvider } from "./chatStateContext"
import { ChatCredentialsProvider } from "./credentialsContext"
import { ChatSocketProvider } from "./socketContext"
import { ChatStreamProvider } from "./streamContext"
import { ChatCredentials } from "./types"

type Props = ChatCredentials & ChildrenProps

function ChatContainer(props: Props) {
  return (
    <ChatStateProvider>
      <ChatStreamProvider>
        <ChatCredentialsProvider {...props}>
          <ChatSocketProvider>{props.children}</ChatSocketProvider>
        </ChatCredentialsProvider>
      </ChatStreamProvider>
    </ChatStateProvider>
  )
}

export default ChatContainer
