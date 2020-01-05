import { observer } from "mobx-react-lite"
import React from "react"
import { userListBreakpoint } from "../../channel/constants"
import { CharacterStore } from "../../character/CharacterStore.new"
import MessageList from "../../message/MessageList"
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
  if (!room) {
    return <NoRoomHeader />
  }

  return (
    <Container>
      <ContentArea>
        <header>header</header>
        <MessageListContainer>
          <MessageList
            messages={room.messages}
            characterStore={characterStore}
          />
        </MessageListContainer>
        <Chatbox
          value={room.input}
          placeholder={`Chatting as ${identity}...`}
          onValueChange={room.setInput}
          onSubmit={(text) => console.log(`submitted: ${text}`)}
        />
      </ContentArea>
      {room.users && (
        <UserListContainer>
          <RoomUserList users={room.users.map(characterStore.get)} />
        </UserListContainer>
      )}
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
