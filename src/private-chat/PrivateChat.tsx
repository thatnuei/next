import { observer } from "mobx-react-lite"
import React from "react"
import Chatbox from "../chat/Chatbox"
import MessageList from "../message/MessageList"
import { fillArea } from "../ui/helpers"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"
import { PrivateChatModel } from "./PrivateChatModel"

type Props = { privateChat: PrivateChatModel }

function PrivateChat({ privateChat }: Props) {
  return (
    <Container>
      <header>private chat header</header>
      <div style={{ flex: 1 }}>
        <MessageList messages={privateChat.messages} />
      </div>
      <ChatboxContainer>
        <Chatbox onSubmit={alert} />
      </ChatboxContainer>
    </Container>
  )
}

export default observer(PrivateChat)

const Container = styled.div`
  display: flex;
  flex-direction: column;
  ${fillArea};
`

const ChatboxContainer = styled.div`
  background-color: ${(props) => props.theme.colors.theme0};
  padding: ${spacing.xsmall};
`
