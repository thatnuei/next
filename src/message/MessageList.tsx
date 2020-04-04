import React from "react"
import tw from "twin.macro"
import { scrollVertical } from "../ui/helpers"
import MessageListItem from "./MessageListItem"
import { MessageListModel } from "./MessageListModel"
import { MessageModel } from "./MessageModel"

type Props = {
  list: MessageListModel
  filter?: (message: MessageModel) => boolean
}

function MessageList({ list, filter: shouldShow = () => true }: Props) {
  return (
    <ol css={[tw`w-full h-full`, scrollVertical]}>
      {list.items.map((message) =>
        shouldShow(message) ? (
          <li key={message.key}>
            <MessageListItem message={message} />
          </li>
        ) : null,
      )}
    </ol>
  )
}

export default MessageList
