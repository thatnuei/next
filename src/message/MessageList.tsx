import React, { useCallback, useLayoutEffect, useState } from "react"
import { fillArea, scrollVertical } from "../ui/helpers"
import { styled } from "../ui/styled"
import { getThemeColor } from "../ui/theme"
import Message from "./Message"
import MessageModel from "./MessageModel"

type Props = { messages: MessageModel[] }

function MessageList({ messages }: Props) {
  const [container, setContainer] = useState<HTMLElement | null>()

  useBottomScroll(container, messages[messages.length - 1])

  return (
    <Container ref={setContainer}>
      {messages.map((message) => (
        <Message key={message.id} model={message} />
      ))}
    </Container>
  )
}

export default MessageList

const Container = styled.div`
  ${fillArea};
  ${scrollVertical};
  background-color: ${getThemeColor("theme1")};
`

function useBottomScroll(
  element: HTMLElement | null | undefined,
  value: unknown,
) {
  const wasBottomScrolled =
    element != null &&
    element.scrollTop >= element.scrollHeight - element.clientHeight - 100

  const scrollToBottom = useCallback(() => {
    if (element) element.scrollTop = element.scrollHeight
  }, [element])

  useLayoutEffect(() => {
    if (wasBottomScrolled) scrollToBottom()
  }, [scrollToBottom, wasBottomScrolled, value])

  useLayoutEffect(scrollToBottom, [element])
}
