import React from "react"
import tw from "twin.macro"
import { scrollVertical } from "../ui/helpers"
import MessageListItem from "./MessageListItem"
import { Message } from "./types"

type Props = { messages: Message[] }

function MessageList({ messages }: Props) {
  return (
    <ol css={[tw`w-full h-full`, scrollVertical]}>
      {messages.map(({ key, ...message }) => (
        <li key={key}>
          <MessageListItem {...message} />
        </li>
      ))}
    </ol>
  )
}

export default MessageList
