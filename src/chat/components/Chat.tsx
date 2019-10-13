import { observer } from "mobx-react-lite"
import React from "react"
import ChannelBrowser from "../../channel/ChannelBrowser"
import ChannelMenu from "../../channel/ChannelMenu"
import CharacterMenu from "../../character/components/CharacterMenu"
import ContextMenu from "../../ui/components/ContextMenu"
import Drawer from "../../ui/components/Drawer"
import Modal from "../../ui/components/Modal"
import { styled } from "../../ui/styled"
import { spacing } from "../../ui/theme"
import useRootStore from "../../useRootStore"
import { sidebarMenuBreakpoint } from "../constants"
import ChatRoomView from "./ChatRoomView"
import Navigation from "./Navigation"

function Chat() {
  const root = useRootStore()
  const { currentChannel } = root.chatNavigationStore
  const {
    characterMenu,
    characterMenuTarget,
    characterMenuPosition,
  } = root.chatOverlayStore

  return (
    <Container>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>

      <RoomContainer>
        <ChatRoomView />
      </RoomContainer>

      <Drawer
        side="left"
        children={<Navigation />}
        {...root.chatOverlayStore.primaryNavigation.overlayProps}
      />

      <Modal
        title="Channels"
        panelWidth={400}
        panelHeight={600}
        children={<ChannelBrowser />}
        {...root.chatOverlayStore.channelBrowser.overlayProps}
      />

      <Drawer
        side="right"
        children={currentChannel && <ChannelMenu channel={currentChannel} />}
        {...root.chatOverlayStore.channelMenu.overlayProps}
      />

      <ContextMenu
        position={characterMenuPosition}
        children={
          characterMenuTarget && (
            <CharacterMenu characterName={characterMenuTarget} />
          )
        }
        {...characterMenu.overlayProps}
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

  @media (max-width: ${sidebarMenuBreakpoint}px) {
    display: none;
  }
`

const RoomContainer = styled.section`
  flex: 1;
`
