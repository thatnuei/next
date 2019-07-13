import { observer } from "mobx-react-lite"
import { cover } from "polished"
import React from "react"
import ChannelBrowser from "../channel/ChannelBrowser"
import ChannelView from "../channel/ChannelView"
import { CharacterMenuProvider } from "../character/CharacterMenuContext"
import { OverlayProvider } from "../overlay/OverlayContext"
import { useRootStore } from "../RootStore"
import { spacedChildrenHorizontal } from "../ui/helpers"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"
import ChatNavigation from "./ChatNavigation"
import ChatNavigationOverlay from "./ChatNavigationOverlay"
import OnlineUsers from "./OnlineUsers"
import StatusOverlay from "./StatusOverlay"
import useChatNavBreakpoint from "./useChatNavBreakpoint"

const ChatScreen = () => {
  const { channelStore, viewStore, overlayStore } = useRootStore()
  const navigationVisible = useChatNavBreakpoint()

  function renderChatRoom() {
    const { chatRoom } = viewStore

    switch (chatRoom.name) {
      case "console": {
        return <p>console</p>
      }

      case "channel": {
        const channel = channelStore.channels.get(chatRoom.channel)
        return <ChannelView channel={channel} />
      }

      case "privateChat": {
        return <p>privateChat</p>
      }
    }
  }

  return (
    <CharacterMenuProvider>
      <Container>
        {navigationVisible && <ChatNavigation />}
        {renderChatRoom()}
      </Container>

      <OverlayProvider value={overlayStore.chatNav}>
        <ChatNavigationOverlay />
      </OverlayProvider>

      <OverlayProvider value={overlayStore.updateStatus}>
        <StatusOverlay />
      </OverlayProvider>

      <OverlayProvider value={overlayStore.channelBrowser}>
        <ChannelBrowser />
      </OverlayProvider>

      <OverlayProvider value={overlayStore.onlineUsers}>
        <OnlineUsers />
      </OverlayProvider>
    </CharacterMenuProvider>
  )
}
export default observer(ChatScreen)

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.theme2};
  display: flex;
  ${cover()};
  ${spacedChildrenHorizontal(spacing.xsmall)};
`
