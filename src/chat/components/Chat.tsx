import React from "react"
import ChannelBrowserModal from "../../channel/ChannelBrowserModal"
import { useStore } from "../../store/hooks"
import { styled } from "../../ui/styled"
import { spacing } from "../../ui/theme"
import { ChatRoom } from "../state"
import Navigation from "./Navigation"

function Chat() {
  const { state } = useStore()

  const currentRoom = state.chat.currentRoom as ChatRoom | undefined

  function renderChatRoom() {
    if (!currentRoom?.type) {
      return <p>lol</p>
    }

    switch (currentRoom.type) {
      case "channel": {
        const channel = state.channel.getChannel(currentRoom.id)
        return <p>{channel.title}</p>
      }
    }
  }

  return (
    <Container>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
      <RoomContainer>{renderChatRoom()}</RoomContainer>
      <ChannelBrowserModal />
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

  @media (max-width: 950px) {
    display: none;
  }
`

const RoomContainer = styled.section`
  flex: 1;
`
