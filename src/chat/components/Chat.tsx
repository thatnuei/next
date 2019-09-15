import { cover } from "polished"
import React from "react"
import { useStore } from "../../store"
import { styled } from "../../ui/styled"
import { spacing } from "../../ui/theme"
import Navigation from "./Navigation"

function Chat() {
  const {
    state: {
      chat: { currentRoom },
    },
  } = useStore()

  function renderChatRoom() {
    switch (currentRoom.type) {
      case "console": {
        return <p>console</p>
      }

      case "channel": {
        return <p>channel</p>
      }
    }
  }

  return (
    <Container>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
      <RoomContainer>{renderChatRoom()}</RoomContainer>
    </Container>
  )
}

export default Chat

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.theme2};
  ${cover()};

  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 220px auto;
  grid-gap: ${spacing.xsmall};
`

const NavigationContainer = styled.nav`
  @media (max-width: 950px) {
    display: none;
  }
`

const RoomContainer = styled.section``
