import { useObserver } from "mobx-react-lite"
import React, { useCallback, useLayoutEffect, useState } from "react"
import tw from "twin.macro"
import { scrollVertical } from "../ui/helpers"
import { MessageListModel } from "./message-list-model"
import { MessageModel } from "./message-model"
import MessageListItem from "./MessageListItem"

type Props = {
  list: MessageListModel
  filter?: (message: MessageModel) => boolean
}

const scrolledToBottomThreshold = 100

function MessageList({ list, filter: shouldShow = () => true }: Props) {
  const [container, setContainer] = useState<HTMLElement | null>()

  const lastMessage = useObserver(() => {
    return list.messages.length > 0 && list.messages[list.messages.length - 1]
  })
  useBottomScroll(container, lastMessage)

  return useObserver(() => (
    <ol css={[tw`w-full h-full`, scrollVertical]} ref={setContainer}>
      {list.messages.map((message) =>
        shouldShow(message) ? (
          <li key={message.key}>
            <MessageListItem message={message} css={tw`mb-px2`} />
          </li>
        ) : null,
      )}
    </ol>
  ))
}

export default MessageList

function useBottomScroll(
  container: HTMLElement | null | undefined,
  watchedValue: unknown,
) {
  const wasScrolledToBottom =
    container &&
    container.scrollHeight >=
      container.scrollHeight -
        container.clientHeight -
        scrolledToBottomThreshold

  const scrollToBottom = useCallback(() => {
    if (!container) return
    container.scrollTop = container.scrollHeight
  }, [container])

  useLayoutEffect(() => {
    if (wasScrolledToBottom) scrollToBottom()
  }, [scrollToBottom, wasScrolledToBottom, watchedValue])

  useLayoutEffect(scrollToBottom, [container])
}
