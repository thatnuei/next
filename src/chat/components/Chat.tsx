import { cover } from "polished"
import React from "react"
import { useSelector } from "../../store/hooks"
import { getCurrentRoom } from "../../store/selectors"
import { styled } from "../../ui/styled"
import { spacing } from "../../ui/theme"
import Navigation from "./Navigation"

function Chat() {
  const currentRoom = useSelector(getCurrentRoom())

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
  display: flex;
  background-color: ${({ theme }) => theme.colors.theme2};
  ${cover()};
`

const NavigationContainer = styled.div`
  flex-basis: 240px;
  margin-right: ${spacing.xsmall};

  @media (max-width: 950px) {
    display: none;
  }
`

const RoomContainer = styled.section`
  flex: 1;
`
