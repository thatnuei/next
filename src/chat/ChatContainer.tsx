import React from "react"
import { ChildrenProps } from "../jsx/types"
import { ChatStateProvider } from "./chatStateContext"
import { CommandStreamProvider } from "./commandStreamContext"
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
          <CommandStreamProvider>
            <ChatSocketProvider>{props.children}</ChatSocketProvider>
          </CommandStreamProvider>
        </ChatCredentialsProvider>
      </ChatStreamProvider>
    </ChatStateProvider>
  )
}

export default ChatContainer
