import { observer } from "mobx-react-lite"
import React, { useEffect, useMemo, useState } from "react"
import ChannelBrowser from "../channel/ChannelBrowser"
import { ChannelBrowserStore } from "../channel/ChannelBrowserStore"
import { ChannelStore } from "../channel/ChannelStore"
import { CharacterStore } from "../character/CharacterStore"
import { PrivateChatStore } from "../private-chat/PrivateChatStore"
import { useChannel } from "../state/hooks/useChannel"
import Modal from "../ui/components/Modal"
import {
  absoluteCover,
  bgMidnight,
  block,
  displayNone,
  flex,
  flex1,
  media,
  mr,
  w,
} from "../ui/helpers.new"
import { ChatNavigationStore } from "./ChatNavigationStore"
import ChatRoomDisplay from "./ChatRoomDisplay"
import { ChatStore } from "./ChatStore"
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

type ChatOverlay = { name: "channelBrowser" }

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

  // overlay state
  const [overlay, setOverlay] = useState<ChatOverlay>()

  const showChannelBrowser = () => {
    setOverlay({ name: "channelBrowser" })
    channelBrowserStore.refresh()
  }

  const clearOverlay = () => setOverlay(undefined)

  const navigationActions = (
    <>
      <NavigationAction
        title="Channels"
        icon="channels"
        onClick={showChannelBrowser}
      />
      <NavigationAction title="Update Status" icon="updateStatus" />
      <NavigationAction title="Who's Online" icon="users" />
      <NavigationAction title="About" icon="about" />
      <div css={flex1} />
      <NavigationAction title="Logout" icon="logout" />
    </>
  )

  return (
    <div css={[absoluteCover, flex(), bgMidnight(900)]}>
      <nav css={[w(64), mr(1), displayNone, media.lg(block)]}>
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
      </nav>

      <main css={flex1}>
        {navigationStore.currentRoom ? (
          <ChatRoomDisplay
            room={navigationStore.currentRoom}
            identity={identity}
            channelStore={channelStore}
            privateChatStore={privateChatStore}
            characterStore={characterStore}
          />
        ) : (
          <NoRoomHeader />
        )}
      </main>

      <Modal
        title="Channel Browser"
        visible={overlay?.name === "channelBrowser"}
        onClose={clearOverlay}
        panelWidth={500}
        panelHeight={700}
      >
        <ChannelBrowser
          channelStore={channelStore}
          channelBrowserStore={channelBrowserStore}
        />
      </Modal>
    </div>
  )
}

export default observer(Chat)
