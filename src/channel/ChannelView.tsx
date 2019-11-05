import { observer } from "mobx-react-lite"
import React from "react"
import Chatbox from "../chat/components/Chatbox"
import useMedia from "../dom/hooks/useMedia"
import MessageList from "../message/MessageList"
import Drawer from "../ui/components/Drawer"
import Modal from "../ui/components/Modal"
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
import useOverlay from "../ui/useOverlay"
import useRootStore from "../useRootStore"
import ChannelDescription from "./ChannelDescription"
import ChannelHeader from "./ChannelHeader"
import ChannelMenu from "./ChannelMenu"
import ChannelModel from "./ChannelModel"
import ChannelUserList from "./ChannelUserList"
import { userListBreakpoint } from "./constants"

type Props = { channel: ChannelModel }

function ChannelView({ channel }: Props) {
  const root = useRootStore()
  const isUserListVisible = useMedia(`(min-width: ${userListBreakpoint}px)`)
  const descriptionModal = useOverlay()
  const channelMenuDrawer = useOverlay()

  return (
    <>
      <Container>
        <ContentArea>
          <ChannelHeader
            title={channel.name}
            onShowDescription={descriptionModal.show}
            onShowChannelMenu={channelMenuDrawer.show}
          />

          <MessageListContainer>
            <MessageList messages={channel.messages} />

            <Modal
              title={channel.name}
              fillMode="contained"
              children={<ChannelDescription channel={channel} />}
              panelWidth={1200}
              panelHeight={600}
              {...descriptionModal}
            />
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

      <Drawer
        side="right"
        children={<ChannelMenu channel={channel} />}
        {...channelMenuDrawer}
      />
    </>
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
