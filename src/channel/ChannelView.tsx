import { observer } from "mobx-react-lite"
import React from "react"
import Chatbox from "../chat/components/Chatbox"
import useMedia from "../dom/hooks/useMedia"
import MessageList from "../message/MessageList"
import {
  fillArea,
  flexColumn,
  flexGrow,
  flexRow,
  spacedChildrenHorizontal,
  spacedChildrenVertical,
} from "../ui/helpers"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"
import useRootStore from "../useRootStore"
import ChannelHeader from "./ChannelHeader"
import ChannelModel from "./ChannelModel"
import ChannelUserList from "./ChannelUserList"
import { userListBreakpoint } from "./constants"

type Props = { channel: ChannelModel }

function ChannelView({ channel }: Props) {
  const root = useRootStore()
  const isUserListVisible = useMedia(`(min-width: ${userListBreakpoint}px)`)

  return (
    <Container>
      <ContentArea>
        <ChannelHeader channel={channel} />

        <MessageListContainer>
          <MessageList messages={channel.messages} />
        </MessageListContainer>

        <Chatbox
          value={channel.chatboxInput}
          onValueChange={channel.setChatboxInput}
          onSubmit={(text) => root.channelStore.sendMessage(channel.id, text)}
        />
      </ContentArea>

      {isUserListVisible && (
        <UserListContainer>
          <ChannelUserList channel={channel} />
        </UserListContainer>
      )}
    </Container>
  )
}

export default observer(ChannelView)

const Container = styled.div`
  ${fillArea};
  ${flexRow};
  ${spacedChildrenHorizontal(spacing.xsmall)};
`

const ContentArea = styled.div`
  ${flexGrow};
  ${flexColumn};
  ${spacedChildrenVertical(spacing.xsmall)};
`

const MessageListContainer = styled.div`
  ${flexGrow};
  position: relative;
`

const UserListContainer = styled.div`
  flex-basis: 220px;
`
