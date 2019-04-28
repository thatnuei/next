import { observer } from "mobx-react-lite"
import React from "react"
import styled, { CSSObject } from "styled-components"
import CharacterName from "../character/CharacterName"
import { useRootStore } from "../RootStore"
import BBC from "../ui/BBC"
import { semiBlack } from "../ui/colors"
import { css } from "../ui/styled"
import { MessageType } from "./types"

type Props = {
  senderName?: string
  text: string
  type: MessageType
  time: number
}

const actionRegex = /^\s*\/me\s*/

// TODO: rename to Message
const MessageListItem = ({ senderName, text, type, time }: Props) => {
  const { characterStore } = useRootStore()

  const sender = senderName
    ? characterStore.characters.get(senderName)
    : undefined

  const isAction = actionRegex.test(text)
  const parsedText = text.replace(actionRegex, "")

  return (
    <Container css={[highlightStyles[type], isAction && actionStyle]}>
      <DateText>{new Date(time).toLocaleTimeString()}</DateText>
      <SenderText>
        {sender ? (
          <CharacterName name={sender.name} />
        ) : (
          <strong>System</strong>
        )}
      </SenderText>
      <BBC text={parsedText} />
    </Container>
  )
}

export default observer(MessageListItem)

const highlightStyles: { [K in MessageType]?: CSSObject } = {
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

const actionStyle = css`
  font-style: italic;
`
