import React, { useEffect, useMemo } from "react"
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
}

function Chat({ account, ticket, identity }: Props) {
  const socketStore = useMemo(() => new SocketStore(), [])
  const chatStore = useMemo(() => new ChatStore(identity), [identity])

  useEffect(() => {
    return socketStore.connect({ account, ticket, identity })
  }, [socketStore, account, identity, ticket])

  useEffect(() => {
    return socketStore.commandListeners.add(chatStore.handleSocketCommand)
  }, [chatStore.handleSocketCommand, socketStore.commandListeners])

  return (
    <Container>
      <NavigationContainer>
        <Navigation identityCharacter={chatStore.identityCharacter} />
      </NavigationContainer>
      <RoomContainer>room</RoomContainer>
    </Container>
  )
}

export default Chat

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
