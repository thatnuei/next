import { observer } from "mobx-react-lite"
import React, { useEffect, useMemo } from "react"
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
  const socketStore = useMemo(() => new SocketStore(), [])
  const chatStore = useMemo(() => new ChatStore(identity), [identity])

  useEffect(() => {
    return socketStore.connect({ account, ticket, identity })
  }, [socketStore, account, identity, ticket])

  useListener(socketStore.commandListeners, chatStore.handleSocketCommand)
  useListener(socketStore.closeListeners, onClose)
  useListener(socketStore.closeListeners, onConnectionError)

  return (
    <Container>
      <NavigationContainer>
        <Navigation identityCharacter={chatStore.identityCharacter} />
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
