import { observe } from "mobx"
import React, { useEffect, useRef } from "react"
import { flexGrow, scrollVertical } from "../ui/helpers"
import MessageListItem from "./MessageListItem"
import MessageModel from "./MessageModel"

export default function MessageList(props: { messages: MessageModel[] }) {
  const messageListRef = useRef<HTMLUListElement>(null)

  useBottomScroll(messageListRef, props.messages)

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
  useEffect(() => {
    const element = elementRef.current
    if (element) element.scrollTop = element.scrollHeight

    return observe(value as Object, () => {
      const element = elementRef.current
      if (!element) return

      const wasBottomScrolled =
        element != null &&
        element.scrollTop >= element.scrollHeight - element.clientHeight - 100

      requestAnimationFrame(() => {
        if (wasBottomScrolled) {
          element.scrollTop = element.scrollHeight
        }
      })
    })
  })
}
