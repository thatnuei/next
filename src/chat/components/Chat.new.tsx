import { observer } from "mobx-react-lite"
import React, { useEffect, useMemo } from "react"
import { ChannelStore } from "../../channel/ChannelStore.new"
import { CharacterStore } from "../../character/CharacterStore.new"
import Avatar from "../../character/components/Avatar"
import { PrivateChatStore } from "../../private-chat/PrivateChatStore.new"
import { useListener } from "../../state/hooks/useListener"
import Icon from "../../ui/components/Icon"
import { styled } from "../../ui/styled"
import { spacing } from "../../ui/theme"
import { ChatNavigationStore } from "../ChatNavigationStore.new"
import { ChatStore } from "../ChatStore.new"
import { sidebarMenuBreakpoint } from "../constants"
import { SocketStore } from "../SocketStore.new"
import Navigation from "./Navigation"
import RoomTab from "./RoomTab"

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
    [channelStore, identity, privateChatStore],
  )
  useListener(socketStore.commandListeners, navigationStore.handleSocketCommand)

  return (
    <Container>
      <NavigationContainer>
        <Navigation identityCharacter={identityCharacter}>
          {navigationStore.rooms.map((room) => {
            switch (room.type) {
              case "channel": {
                const channel = channelStore.get(room.channelId)
                return (
                  <RoomTab
                    key={room.roomId}
                    title={channel.name}
                    icon={<Icon icon="public" />}
                    isActive={navigationStore.currentRoom === room}
                    isUnread={channel.unread}
                    onClick={() => navigationStore.showChannel(channel.id)}
                    onClose={() => channelStore.leave(channel.id)}
                  />
                )
              }

              case "privateChat": {
                const chat = privateChatStore.get(room.partnerName)
                return (
                  <RoomTab
                    key={room.roomId}
                    title={chat.partnerName}
                    icon={<Avatar name={chat.partnerName} size={20} />}
                    isActive={navigationStore.currentRoom === room}
                    isUnread={chat.unread}
                    onClick={() =>
                      navigationStore.showPrivateChat(chat.partnerName)
                    }
                    onClose={() =>
                      navigationStore.closePrivateChat(chat.partnerName)
                    }
                  />
                )
              }

              default:
                return null
            }
          })}
        </Navigation>
      </NavigationContainer>
      <RoomContainer>room</RoomContainer>
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

const NavigationContainer = styled.div`
  flex-basis: 240px;
  margin-right: ${spacing.xsmall};

  @media (max-width: ${sidebarMenuBreakpoint}px) {
    display: none;
  }
`

const RoomContainer = styled.section`
  flex: 1;
`
