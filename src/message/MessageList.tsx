import React from "react"
import tw from "twin.macro"
import { scrollVertical } from "../ui/helpers"
import MessageListItem from "./MessageListItem"
import { MessageModel } from "./MessageModel"

type Props = {
  messages: readonly MessageModel[]
}

function MessageList({ messages }: Props) {
  return (
    <ol css={[tw`w-full h-full`, scrollVertical]}>
      {messages.map((message) => (
        <li key={message.key}>
          <MessageListItem message={message} />
        </li>
      ))}
    </ol>
  )
}

export default MessageList
