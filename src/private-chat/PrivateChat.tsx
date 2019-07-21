import { observer } from "mobx-react-lite"
import React from "react"
import Avatar from "../character/Avatar"
import CharacterName from "../character/CharacterName"
import CharacterStatus from "../character/CharacterStatus"
import Chatbox from "../chat/Chatbox"
import ChatMenuButton from "../chat/ChatMenuButton"
import { TypingStatus } from "../chat/types"
import TypingStatusIndicator from "../chat/TypingStatusIndicator"
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

  const handleCommand = (command: string, ...args: string[]) => {
    switch (command) {
      case "roll": {
        const dice = args.length > 0 ? args.join(" ") : "1d20"
        privateChatStore.sendRoll(privateChat.partner, dice)
        break
      }

      default:
        console.error(`Unknown command /${command} ${args.join(" ")}`)
    }
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

      <TypingStatusContainer>
        <TypingStatusIndicator
          name={privateChat.partner}
          status={privateChat.partnerTypingStatus}
        />
      </TypingStatusContainer>

      <ChatboxContainer>
        <Chatbox
          value={privateChat.chatboxInput}
          onValueChange={privateChat.setChatboxInput}
          onSubmit={handleChatboxSubmit}
          onSubmitCommand={handleCommand}
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

const TypingStatusContainer = styled.div`
  background-color: ${(props) => props.theme.colors.theme1};
  padding: ${spacing.xsmall} ${spacing.small};
`

const NameAndStatusContainer = styled.div`
  ${flexColumn};
`
