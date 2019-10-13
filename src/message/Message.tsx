import { observer } from "mobx-react-lite"
import React from "react"
import styled from "styled-components"
import BBC from "../bbc/BBC"
import CharacterName from "../character/components/CharacterName"
import { semiBlack } from "../ui/colors"
import useRootStore from "../useRootStore"
import MessageModel from "./MessageModel"
import { MessageType } from "./types"

type Props = {
  model: MessageModel
}

const actionRegex = /^\s*\/me\s*/

const Message = ({ model }: Props) => {
  const { senderName, text, type, time } = model
  const { characterStore } = useRootStore()

  const sender = senderName
    ? characterStore.characters.get(senderName)
    : undefined

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
          <CharacterName name={sender.name} />
        </SenderText>
      )}

      <BBC text={parsedText} />
    </Container>
  )
}

export default observer(Message)

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
