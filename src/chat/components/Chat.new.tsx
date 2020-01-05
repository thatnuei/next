import { observer } from "mobx-react-lite"
import React, { useEffect, useMemo } from "react"
import { ChannelStore } from "../../channel/ChannelStore.new"
import { CharacterStore } from "../../character/CharacterStore.new"
import { PrivateChatStore } from "../../private-chat/PrivateChatStore.new"
import { useListener } from "../../state/hooks/useListener"
import { styled } from "../../ui/styled"
import { spacing } from "../../ui/theme"
import { ChatNavigationStore } from "../ChatNavigationStore.new"
import { ChatStore } from "../ChatStore.new"
import { sidebarMenuBreakpoint } from "../constants"
import { SocketStore } from "../SocketStore.new"
import Navigation from "./Navigation"
import NavigationRooms from "./NavigationRooms"
import RoomDisplay from "./RoomDisplay"

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
    () => new ChatNavigationStore(identity, channelStore, privateChatStore),
    [identity, channelStore, privateChatStore],
  )
  useListener(socketStore.commandListeners, navigationStore.handleSocketCommand)

  return (
    <Container>
      <NavigationContainer>
        <Navigation identityCharacter={identityCharacter}>
          <NavigationRooms navigation={navigationStore} />
        </Navigation>
      </NavigationContainer>
      <RoomContainer>
        <RoomDisplay
          room={navigationStore.currentRoom}
          characterStore={characterStore}
          identity={identity}
        />
      </RoomContainer>
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

  @media (max-width: ${sidebarMenuBreakpoint}px) {
    display: none;
  }
`

const RoomContainer = styled.main`
  flex: 1;
`
