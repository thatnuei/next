import { observer } from "mobx-react-lite"
import React from "react"
import Avatar from "../character/Avatar"
import CharacterName from "../character/CharacterName"
import CharacterStatus from "../character/CharacterStatus"
import Chatbox from "../chat/Chatbox"
import ChatMenuButton from "../chat/ChatMenuButton"
import { TypingStatus } from "../chat/types"
import MessageList from "../message/MessageList"
import { useRootStore } from "../RootStore"
import { fillArea, flexColumn, spacedChildrenHorizontal } from "../ui/helpers"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"
import { PrivateChatModel } from "./PrivateChatModel"

type Props = { privateChat: PrivateChatModel }

function PrivateChat({ privateChat }: Props) {
  const { privateChatStore } = useRootStore()

  const handleChatboxSubmit = (message: string) => {
    privateChatStore.sendMessage(privateChat.partner, message)
  }

  const handleTypingStatus = (status: TypingStatus) => {
    privateChatStore.updateTypingStatus(privateChat.partner, status)
  }

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
        <Chatbox
          onSubmit={handleChatboxSubmit}
          onTypingStatus={handleTypingStatus}
        />
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
  background-color: ${(props) => props.theme.colors.theme1};
  flex: 1;
`

const NameAndStatusContainer = styled.div`
  ${flexColumn};
`
