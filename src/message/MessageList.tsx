import { useObserver } from "mobx-react-lite"
import React, { useCallback, useLayoutEffect, useState } from "react"
import tw from "twin.macro"
import { TagProps } from "../jsx/types"
import { scrollVertical } from "../ui/helpers"
import { MessageListState } from "./message-list-state"
import { MessageState } from "./message-state"
import MessageListItem from "./MessageListItem"

type Props = {
  list: MessageListState
  filter?: (message: MessageState) => boolean
} & TagProps<"ol">

const scrolledToBottomThreshold = 20

function MessageList({
  list,
  filter: shouldShow = () => true,
  ...props
}: Props) {
  const [container, setContainer] = useState<HTMLElement | null>()

  const lastMessage = useObserver(() => {
    return list.messages.length > 0 && list.messages[list.messages.length - 1]
  })
  useBottomScroll(container, lastMessage)

  return useObserver(() => (
    <ol css={[scrollVertical]} ref={setContainer} {...props}>
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
