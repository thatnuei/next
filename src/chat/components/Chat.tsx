import { observer } from "mobx-react-lite"
import React, { useEffect, useMemo } from "react"
import ChannelRoom from "../../channel/ChannelRoom"
import { ChannelStore } from "../../channel/ChannelStore.new"
import { CharacterStore } from "../../character/CharacterStore.new"
import PrivateChatRoom from "../../private-chat/PrivateChatRoom"
import { PrivateChatStore } from "../../private-chat/PrivateChatStore.new"
import { useListener } from "../../state/hooks/useListener"
import { styled } from "../../ui/styled"
import { spacing } from "../../ui/theme"
import { ChatNavigationStore } from "../ChatNavigationStore.new"
import { ChatStore } from "../ChatStore.new"
import { chatNavigationBreakpoint } from "../constants"
import { SocketStore } from "../SocketStore.new"
import Navigation from "./Navigation"
import NavigationRooms from "./NavigationRooms"
import NoRoomHeader from "./NoRoomHeader"

type Props = {
  account: string
  ticket: string
  identity: string
  onClose: () => void
  onConnectionError: () => void
}

function Chat({
  account,
  ticket,
  identity,
  onClose,
  onConnectionError,
}: Props) {
  // socket
  const socketStore = useMemo(() => new SocketStore(), [])
  useEffect(() => {
    return socketStore.connect({ account, ticket, identity })
  }, [socketStore, account, identity, ticket])
  useListener(socketStore.closeListeners, onClose)
  useListener(socketStore.errorListeners, onConnectionError)

  // chat
  const chatStore = useMemo(() => new ChatStore(), [])
  useListener(socketStore.commandListeners, chatStore.handleSocketCommand)

  // character
  const characterStore = useMemo(() => new CharacterStore(), [])
  const identityCharacter = characterStore.get(identity)
  useListener(socketStore.commandListeners, characterStore.handleSocketCommand)

  // channel
  const channelStore = useMemo(() => new ChannelStore(socketStore, identity), [
    identity,
    socketStore,
  ])
  useListener(socketStore.commandListeners, channelStore.handleSocketCommand)

  // private chat
  const privateChatStore = useMemo(() => new PrivateChatStore(), [])
  useListener(
    socketStore.commandListeners,
    privateChatStore.handleSocketCommand,
  )

  // navigation
  const navigationStore = useMemo(
    () => new ChatNavigationStore(identity, channelStore),
    [identity, channelStore],
  )
  useListener(socketStore.commandListeners, navigationStore.handleSocketCommand)

  const renderRoom = () => {
    const room = navigationStore.currentRoom
    if (!room) return <NoRoomHeader />

    const commonProps = { identity, characterStore }

    switch (room.type) {
      case "channel":
        return (
          <ChannelRoom
            channel={channelStore.get(room.channelId)}
            {...commonProps}
          />
        )

      case "privateChat":
        return (
          <PrivateChatRoom
            chat={privateChatStore.get(room.partnerName)}
            {...commonProps}
          />
        )
    }
  }

  return (
    <Container>
      <NavigationContainer>
        <Navigation identityCharacter={identityCharacter}>
          <NavigationRooms
            navigation={navigationStore}
            channelStore={channelStore}
            privateChatStore={privateChatStore}
          />
        </Navigation>
      </NavigationContainer>
      <RoomContainer>{renderRoom()}</RoomContainer>
    </Container>
  )
}

export default observer(Chat)

const Container = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.theme2};
  width: 100vw;
  height: 100vh;
`

const NavigationContainer = styled.nav`
  flex-basis: 240px;
  margin-right: ${spacing.xsmall};

  @media (max-width: ${chatNavigationBreakpoint}px) {
    display: none;
  }
`

const RoomContainer = styled.main`
  flex: 1;
`
