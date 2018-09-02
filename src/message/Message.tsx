import React from "react"
import { CharacterName } from "../character/CharacterName"
import { styled } from "../ui/styled"
import { MessageModel, MessageType } from "./MessageModel"

const messageTypeHighlights: Record<MessageType, string> = {
  ad: "rgba(39, 174, 96, 0.15)",
  admin: "rgba(231, 76, 60, 0.2)",
  normal: "transparent",
  // mention: "rgba(41, 128, 185, 0.3)",
}

type Props = {
  model: MessageModel
}

export const Message = (props: Props) => {
  const { sender, text, type, localeTimeString } = props.model

  return (
    <Container style={{ backgroundColor: messageTypeHighlights[type] }}>
      <Timestamp>[{localeTimeString}]</Timestamp>
      <Sender>{sender ? <CharacterName name={sender} /> : "System"}</Sender>
      <MessageText>{text}</MessageText>
    </Container>
  )
}

const Container = styled.div`
  padding: 0.3rem 0.7rem;
`

const Sender = styled.span`
  margin-right: 0.5rem;
  font-weight: 500;
`

const MessageText = styled.span``

const Timestamp = styled.span`
  font-size: 75%;
  opacity: 0.5;
  float: right;
  margin-left: 0.5rem;
`
