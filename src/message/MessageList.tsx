import { observer } from "mobx-react-lite"
import React, { useCallback, useLayoutEffect, useState } from "react"
import { CharacterStore } from "../character/CharacterStore"
import { fillArea, scrollVertical } from "../ui/helpers"
import { styled } from "../ui/styled"
import { getThemeColor } from "../ui/theme"
import MessageListItem from "./MessageListItem"
import { Message } from "./types"

type Props = {
  messages: readonly Message[]
  characterStore: CharacterStore
}

function MessageList({ messages, characterStore }: Props) {
  const [container, setContainer] = useState<HTMLElement | null>()

  useBottomScroll(container, messages[messages.length - 1])

  return (
    <Container ref={setContainer}>
      {messages.map((message) => (
        <MessageListItem
          key={message.id}
          message={message}
          sender={
            message.senderName
              ? characterStore.get(message.senderName)
              : undefined
          }
        />
      ))}
    </Container>
  )
}

export default observer(MessageList)

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
