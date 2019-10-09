import { observer } from "mobx-react-lite"
import React from "react"
import ChannelBrowser from "../../channel/ChannelBrowser"
import Modal from "../../ui/components/Modal"
import { styled } from "../../ui/styled"
import { spacing } from "../../ui/theme"
import useRootStore from "../../useRootStore"
import ChatRoomView from "./ChatRoomView"
import Navigation from "./Navigation"

function Chat() {
  const { chatNavigationStore } = useRootStore()

  return (
    <Container>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>

      <RoomContainer>
        <ChatRoomView />
      </RoomContainer>

      <Modal
        title="ChannelBrowser"
        visible={chatNavigationStore.channelBrowser.visible}
        onClose={chatNavigationStore.channelBrowser.hide}
        panelWidth={400}
        panelHeight={600}
        children={<ChannelBrowser />}
      />
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
