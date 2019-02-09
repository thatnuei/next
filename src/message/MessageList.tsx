import { observe } from "mobx"
import React, { useEffect, useRef } from "react"
import { flexGrow, scrollVertical } from "../ui/helpers"
import MessageModel from "./MessageModel"
import MessageRow from "./MessageRow"

export default function MessageList(props: { messages: MessageModel[] }) {
  const messageListRef = useRef<HTMLElement>(null)

  useBottomScroll(messageListRef, props.messages)

  return (
    <section css={[flexGrow, scrollVertical]} ref={messageListRef}>
      {props.messages.slice(-300).map((message) => (
        <MessageRow key={message.id} {...message} />
      ))}
    </section>
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
