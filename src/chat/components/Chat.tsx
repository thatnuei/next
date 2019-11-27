import React from "react"
import { styled } from "../../ui/styled"
import { spacing } from "../../ui/theme"
import { sidebarMenuBreakpoint } from "../constants"
import ChatRoomView from "./ChatRoomView"
import Navigation from "./Navigation"

function Chat() {
  return (
    <Container>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
      <RoomContainer>
        <ChatRoomView />
      </RoomContainer>
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
