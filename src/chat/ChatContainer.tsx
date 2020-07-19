import React from "react"
import { RecoilRoot } from "recoil"
import { ChildrenProps } from "../jsx/types"
import { ChatCredentialsProvider } from "./credentialsContext"
import { ChatStreamProvider } from "./streamContext"
import { ChatCredentials } from "./types"

type Props = ChatCredentials & ChildrenProps

function ChatContainer(props: Props) {
  return (
    <ChatStreamProvider>
      <RecoilRoot>
        <ChatCredentialsProvider {...props}>
          {props.children}
        </ChatCredentialsProvider>
      </RecoilRoot>
    </ChatStreamProvider>
  )
}

export default ChatContainer
