import { observer, Observer } from "mobx-react-lite"
import React from "react"
import ChannelDescription from "../../channel/ChannelDescription"
import ChannelHeader from "../../channel/ChannelHeader"
import ChannelMenu from "../../channel/ChannelMenu"
import { userListBreakpoint } from "../../channel/constants"
import { CharacterStore } from "../../character/CharacterStore.new"
import MessageList from "../../message/MessageList"
import { useToggle } from "../../state/hooks/useToggle"
import Drawer from "../../ui/components/Drawer"
import Modal from "../../ui/components/Modal"
import {
  fillArea,
  flexColumn,
  flexGrow,
  flexRow,
  spacedChildrenHorizontal,
  spacedChildrenVertical,
} from "../../ui/helpers"
import { styled } from "../../ui/styled"
import { spacing } from "../../ui/theme"
import { RoomModel } from "../RoomModel.new"
import Chatbox from "./Chatbox"
import NoRoomHeader from "./NoRoomHeader"
import RoomUserList from "./RoomUserList"

type Props = {
  room: RoomModel | undefined
  identity: string
  characterStore: CharacterStore
}

function RoomDisplay({ room, identity, characterStore }: Props) {
  const [menuVisible, menuActions] = useToggle()
  const [descriptionVisible, descriptionActions] = useToggle()

  if (!room) {
    return <NoRoomHeader />
  }

  return (
    <Container>
      <ContentArea>
        {room.header.type === "channel" ? (
          <ChannelHeader
            title={room.title}
            onShowChannelMenu={menuActions.toggle}
            onShowDescription={descriptionActions.toggle}
          />
        ) : (
          <p>todo character header</p>
        )}

        <MessageListContainer>
          <MessageList
            messages={room.messages}
            characterStore={characterStore}
          />

          <Modal
            title={room.title}
            visible={descriptionVisible}
            panelWidth={800}
            children={<ChannelDescription description={room.description} />}
            fillMode="contained"
            onClose={descriptionActions.disable}
          />
        </MessageListContainer>

        <Observer>
          {() => (
            <Chatbox
              value={room.input}
              placeholder={`Chatting as ${identity}...`}
              onValueChange={room.setInput}
              onSubmit={(text) => console.log(`submitted: ${text}`)}
            />
          )}
        </Observer>
      </ContentArea>

      {room.users && (
        <UserListContainer>
          <RoomUserList users={room.users.map(characterStore.get)} />
        </UserListContainer>
      )}

      <Drawer side="right" visible={menuVisible} onClose={menuActions.disable}>
        <ChannelMenuContainer>
          <ChannelMenu users={(room.users ?? []).map(characterStore.get)} />
        </ChannelMenuContainer>
      </Drawer>
    </Container>
  )
}

export default observer(RoomDisplay)

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

  @media (max-width: ${userListBreakpoint}px) {
    display: none;
  }
`

const ChannelMenuContainer = styled.div`
  width: 200px;
  height: 100%;
`
