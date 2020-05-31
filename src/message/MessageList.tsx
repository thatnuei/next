import { useObserver } from "mobx-react-lite"
import React, { useCallback, useLayoutEffect, useState } from "react"
import tw from "twin.macro"
import { TagProps } from "../jsx/types"
import { scrollVertical } from "../ui/helpers"
import MessageListItem from "./MessageListItem"
import { MessageState } from "./MessageState"

type Props = {
  messages: MessageState[]
} & TagProps<"ol">

function MessageList({ messages, ...props }: Props) {
  const [container, setContainer] = useState<HTMLElement | null>()

  useBottomScroll(container, messages[messages.length - 1])

  return useObserver(() => (
    <ol css={[scrollVertical]} ref={setContainer} {...props}>
      {messages.map((message) => (
        <li key={message.key}>
          <MessageListItem message={message} css={tw`mb-px2`} />
        </li>
      ))}
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
    container.scrollHeight >= container.scrollHeight - container.clientHeight

  const scrollToBottom = useCallback(() => {
    if (!container) return
    container.scrollTop = container.scrollHeight
  }, [container])

  useLayoutEffect(() => {
    if (wasScrolledToBottom) scrollToBottom()
  }, [scrollToBottom, wasScrolledToBottom, watchedValue])

  useLayoutEffect(scrollToBottom, [container])
}
