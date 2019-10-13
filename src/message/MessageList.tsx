import { observer } from "mobx-react-lite"
import React from "react"
import { fillArea, scrollVertical } from "../ui/helpers"
import { styled } from "../ui/styled"
import { getThemeColor } from "../ui/theme"
import Message from "./Message"
import MessageModel from "./MessageModel"

type Props = { messages: MessageModel[] }

function MessageList({ messages }: Props) {
  return (
    <Container>
      {messages.map((message) => (
        <Message model={message} />
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
