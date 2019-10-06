import { observer } from "mobx-react-lite"
import React from "react"
import ChannelBrowserModal from "../../channel/ChannelBrowserModal"
import { styled } from "../../ui/styled"
import { spacing } from "../../ui/theme"
import useRootStore from "../../useRootStore"
import Navigation from "./Navigation"

function Chat() {
  const { chatStore, channelStore } = useRootStore()
  const { currentRoom } = chatStore

  function renderChatRoom() {
    if (!currentRoom?.type) {
      return <p>lol</p>
    }

    switch (currentRoom.type) {
      case "channel": {
        const channel = channelStore.channels.get(currentRoom.id)
        return <p>{channel.name}</p>
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

  @media (max-width: 950px) {
    display: none;
  }
`

const RoomContainer = styled.section`
  flex: 1;
`
