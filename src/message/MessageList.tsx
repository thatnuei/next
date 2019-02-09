import React, { useLayoutEffect, useRef } from "react"
import { flexGrow, scrollVertical } from "../ui/helpers"
import MessageListItem from "./MessageListItem"
import MessageModel from "./MessageModel"

export default function MessageList(props: { messages: MessageModel[] }) {
  const messageListRef = useRef<HTMLUListElement>(null)

  useBottomScroll(messageListRef, props.messages[props.messages.length - 1])

  return (
    <ul css={[flexGrow, scrollVertical]} ref={messageListRef}>
      {props.messages.slice(-300).map((message) => (
        <MessageListItem key={message.id} {...message} />
      ))}
    </ul>
  )
}

function useBottomScroll(
  elementRef: React.RefObject<HTMLElement>,
  value: unknown,
) {
  const element = elementRef.current
  const wasBottomScrolled =
    element != null &&
    element.scrollTop >= element.scrollHeight - element.clientHeight - 100

  const scrollToBottom = () => {
    const element = elementRef.current
    if (element) element.scrollTop = element.scrollHeight
  }

  useLayoutEffect(() => {
    if (wasBottomScrolled) scrollToBottom()
  }, [value])

  useLayoutEffect(scrollToBottom, [element])
}
