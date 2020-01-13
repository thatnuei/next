import { observer } from "mobx-react-lite"
import React, { useEffect, useMemo } from "react"
import ChannelBrowser from "../channel/ChannelBrowser"
import { ChannelBrowserStore } from "../channel/ChannelBrowserStore"
import ChannelRoom from "../channel/ChannelRoom"
import { ChannelStore } from "../channel/ChannelStore"
import { CharacterStore } from "../character/CharacterStore"
import PrivateChatRoom from "../private-chat/PrivateChatRoom"
import { PrivateChatStore } from "../private-chat/PrivateChatStore"
import { useChannel } from "../state/hooks/useChannel"
import { useToggle } from "../state/hooks/useToggle"
import Modal from "../ui/components/Modal"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"
import { ChatNavigationStore } from "./ChatNavigationStore"
import { ChatStore } from "./ChatStore"
import { chatNavigationBreakpoint } from "./constants"
import Navigation from "./Navigation"
import NavigationAction from "./NavigationAction"
import NavigationRooms from "./NavigationRooms"
import NoRoomHeader from "./NoRoomHeader"
import { SocketStore } from "./SocketStore"

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
  useChannel(socketStore.closeListeners, onClose)
  useChannel(socketStore.errorListeners, onConnectionError)

  // chat
  const chatStore = useMemo(() => new ChatStore(), [])
  useChannel(socketStore.commandListeners, chatStore.handleSocketCommand)

  // character
  const characterStore = useMemo(() => new CharacterStore(), [])
  const identityCharacter = characterStore.get(identity)
  useChannel(socketStore.commandListeners, characterStore.handleSocketCommand)

  // channel
  const channelStore = useMemo(() => new ChannelStore(socketStore, identity), [
    identity,
    socketStore,
  ])
  useChannel(socketStore.commandListeners, channelStore.handleSocketCommand)

  // private chat
  const privateChatStore = useMemo(() => new PrivateChatStore(), [])
  useChannel(socketStore.commandListeners, privateChatStore.handleSocketCommand)

  // navigation
  const navigationStore = useMemo(
    () => new ChatNavigationStore(identity, channelStore),
    [identity, channelStore],
  )
  useChannel(socketStore.commandListeners, navigationStore.handleSocketCommand)

  // channel browser
  const channelBrowserStore = useMemo(
    () => new ChannelBrowserStore(socketStore),
    [socketStore],
  )
  useChannel(
    socketStore.commandListeners,
    channelBrowserStore.handleSocketCommand,
  )
  const [channelBrowserVisible, channelBrowserActions] = useToggle()

  const showChannelBrowser = () => {
    channelBrowserActions.enable()
    channelBrowserStore.refresh()
  }

  const navigationActions = (
    <>
      <NavigationAction
        title="Channels"
        icon="channels"
        onClick={showChannelBrowser}
      />
      <NavigationAction
        title="Update Status"
        icon="updateStatus"
        // onClick={root.characterStore.showUpdateStatusScreen}
      />
      <NavigationAction title="Who's Online" icon="users" />
      <NavigationAction title="About" icon="about" />
      <Spacer />
      <NavigationAction title="Logout" icon="logout" />
    </>
  )

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
        <Navigation
          actions={navigationActions}
          identityCharacter={identityCharacter}
        >
          <NavigationRooms
            navigation={navigationStore}
            channelStore={channelStore}
            privateChatStore={privateChatStore}
          />
        </Navigation>
      </NavigationContainer>
      <RoomContainer>{renderRoom()}</RoomContainer>

      <Modal
        title="Channel Browser"
        visible={channelBrowserVisible}
        onClose={channelBrowserActions.disable}
        panelWidth={500}
        panelHeight={700}
      >
        <ChannelBrowser
          channelStore={channelStore}
          channelBrowserStore={channelBrowserStore}
        />
      </Modal>
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

const Spacer = styled.div`
  flex: 1;
`
