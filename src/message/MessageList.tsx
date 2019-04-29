import { observer } from "mobx-react-lite"
import React, { useCallback, useLayoutEffect, useRef } from "react"
import Box from "../ui/Box"
import Message from "./Message"
import MessageModel from "./MessageModel"

function MessageList(props: { messages: MessageModel[] }) {
  const messageListRef = useRef<HTMLElement>(null)

  useBottomScroll(messageListRef, props.messages[props.messages.length - 1])

  return (
    <Box
      ref={messageListRef as any}
      overflowY="auto"
      style={{ transform: "translateZ(0)" }}
    >
      {props.messages.slice(-300).map((message) => (
        <Message key={message.id} {...message} />
      ))}
    </Box>
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
