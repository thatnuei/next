import React from "react"
import styled from "styled-components"
import BBC from "../bbc/BBC"
import CharacterName from "../character/components/CharacterName.new"
import { Character } from "../character/types"
import { semiBlack } from "../ui/colors"
import { Message, MessageType } from "./types"

type Props = {
  message: Message
  sender?: Character
}

const actionRegex = /^\s*\/me\s*/

const MessageListItem = ({ message, sender }: Props) => {
  const { text, type, time } = message

  const isAction = actionRegex.test(text)
  const parsedText = text.replace(actionRegex, "")

  const style: React.CSSProperties = {
    ...highlightStyles[type],
    ...(isAction ? { fontStyle: "italic" } : {}),
  }

  return (
    <Container style={style}>
      <DateText>{new Date(time).toLocaleTimeString()}</DateText>
      {sender && (
        <SenderText>
          <CharacterName character={sender} />
        </SenderText>
      )}
      <BBC text={parsedText} />
    </Container>
  )
}

export default MessageListItem

const highlightStyles: { [K in MessageType]?: React.CSSProperties } = {
  lfrp: { backgroundColor: "rgba(39, 174, 96, 0.2)" },
  system: { backgroundColor: semiBlack(0.3) },
  admin: { backgroundColor: "rgb(192, 57, 43, 0.2)" },
}

const Container = styled.li`
  padding: 4px 12px;
`

const SenderText = styled.span`
  margin-right: 8px;
`

const DateText = styled.span`
  float: right;
  margin-left: 1rem;
  opacity: 0.75;
  font-size: 80%;
  font-style: italic;
`
