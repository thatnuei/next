import { observer } from "mobx-react-lite"
import React from "react"
import Avatar from "../character/Avatar"
import CharacterName from "../character/CharacterName"
import CharacterStatus from "../character/CharacterStatus"
import Chatbox from "../chat/Chatbox"
import ChatMenuButton from "../chat/ChatMenuButton"
import MessageList from "../message/MessageList"
import { fillArea, flexColumn, spacedChildrenHorizontal } from "../ui/helpers"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"
import { PrivateChatModel } from "./PrivateChatModel"

type Props = { privateChat: PrivateChatModel }

function PrivateChat({ privateChat }: Props) {
  return (
    <Container>
      <HeaderContainer>
        <ChatMenuButton />
        <Avatar name={privateChat.partner} size={50} />
        <NameAndStatusContainer>
          <CharacterName name={privateChat.partner} hideStatusDot />
          <CharacterStatus name={privateChat.partner} />
        </NameAndStatusContainer>
      </HeaderContainer>

      <MessageListContainer>
        <MessageList messages={privateChat.messages} />
      </MessageListContainer>

      <ChatboxContainer>
        <Chatbox onSubmit={console.log} />
      </ChatboxContainer>
    </Container>
  )
}

export default observer(PrivateChat)

const Container = styled.div`
  ${flexColumn};
  ${fillArea};
`

const ChatboxContainer = styled.div`
  background-color: ${(props) => props.theme.colors.theme0};
  padding: ${spacing.xsmall};
`

const HeaderContainer = styled.header`
  background-color: ${(props) => props.theme.colors.theme0};
  padding: ${spacing.small};

  display: flex;
  align-items: center;
  ${spacedChildrenHorizontal(spacing.small)};
`

const MessageListContainer = styled.div`
  flex: 1;
`

const NameAndStatusContainer = styled.div`
  ${flexColumn};
`
