import { observer } from "mobx-react-lite"
import React, { useCallback, useLayoutEffect, useRef } from "react"
import { flexGrow, scrollVertical } from "../ui/helpers"
import MessageListItem from "./MessageListItem"
import MessageModel from "./MessageModel"

function MessageList(props: { messages: MessageModel[] }) {
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
export default observer(MessageList)

function useBottomScroll(
  elementRef: React.RefObject<HTMLElement>,
  value: unknown,
) {
  const element = elementRef.current
  const wasBottomScrolled =
    element != null &&
    element.scrollTop >= element.scrollHeight - element.clientHeight - 100

  const scrollToBottom = useCallback(() => {
    const element = elementRef.current
    if (element) element.scrollTop = element.scrollHeight
  }, [elementRef])

  useLayoutEffect(() => {
    if (wasBottomScrolled) scrollToBottom()
  }, [scrollToBottom, wasBottomScrolled, value])

  useLayoutEffect(scrollToBottom, [element])
}
