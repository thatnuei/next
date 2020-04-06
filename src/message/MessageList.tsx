import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import { scrollVertical } from "../ui/helpers"
import { MessageListModel } from "./message-list-model"
import MessageListItem from "./MessageListItem"
import { MessageModel } from "./message-model"

type Props = {
  list: MessageListModel
  filter?: (message: MessageModel) => boolean
}

function MessageList({ list, filter: shouldShow = () => true }: Props) {
  return (
    <ol css={[tw`w-full h-full`, scrollVertical]}>
      {list.messages.map((message) =>
        shouldShow(message) ? (
          <li key={message.key}>
            <MessageListItem message={message} css={tw`mb-px2`} />
          </li>
        ) : null,
      )}
    </ol>
  )
}

export default observer(MessageList)
