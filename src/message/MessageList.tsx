import React from "react"
import { scrollVertical, size } from "../ui/style"
import MessageListItem from "./MessageListItem"
import { Message } from "./types"

type Props = { messages: Message[] }

function MessageList({ messages }: Props) {
  return (
    <ol css={[size("full"), scrollVertical]}>
      {messages.map(({ key, ...message }) => (
        <li key={key}>
          <MessageListItem {...message} />
        </li>
      ))}
    </ol>
  )
}

export default MessageList
