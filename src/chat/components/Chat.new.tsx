import { observer } from "mobx-react-lite"
import React, { useEffect, useMemo } from "react"
import { ChannelStore } from "../../channel/ChannelStore.new"
import { CharacterStore } from "../../character/CharacterStore.new"
import { PrivateChatStore } from "../../private-chat/PrivateChatStore.new"
import { useListener } from "../../state/hooks/useListener"
import { styled } from "../../ui/styled"
import { spacing } from "../../ui/theme"
import { ChatStore } from "../ChatStore.new"
import { sidebarMenuBreakpoint } from "../constants"
import { SocketStore } from "../SocketStore.new"
import Navigation from "./Navigation"

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

  return (
    <Container>
      <NavigationContainer>
        <Navigation identityCharacter={identityCharacter}>
          {/* {channelStore.joinedChannels.map((channel) => (
            <RoomTab
              key={channel.id}
              title={channel.name}
              icon={<Icon icon="public" />}
              isActive={false}
              isUnread={channel.unread}
              isLoading={false}
              onClick={() => {}}
              onClose={() => channelStore.leave(channel.id)}
            />
          ))} */}
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
