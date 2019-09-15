import { cover } from "polished"
import React from "react"
import { useStore } from "../../store"
import { spacedChildrenHorizontal } from "../../ui/helpers"
import { styled } from "../../ui/styled"
import { spacing } from "../../ui/theme"

function Chat() {
  // const navigationVisible = useChatNavBreakpoint()

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
        // const channel = channelStore.channels.get(activeTab.channelId)
        // return <ChannelView channel={channel} />
      }

      // case "privateChat": {
      // return <p>private chat</p>
      // const chat = privateChatStore.privateChats.get(activeTab.partnerName)
      // return <PrivateChat privateChat={chat} />
      // }
    }
  }

  return (
    // <CharacterMenuProvider>
    <Container>
      {/* {navigationVisible && <ChatNavigation />} */}
      <RoomContainer>{renderChatRoom()}</RoomContainer>
    </Container>

    // <OverlayProvider value={overlayStore.chatNav}>
    //   <ChatNavigationOverlay />
    // </OverlayProvider>
    //
    // <OverlayProvider value={overlayStore.updateStatus}>
    //   <StatusOverlay />
    // </OverlayProvider>
    //
    // <OverlayProvider value={overlayStore.channelBrowser}>
    //   <ChannelBrowser />
    // </OverlayProvider>
    //
    // <OverlayProvider value={overlayStore.onlineUsers}>
    //   <OnlineUsers />
    // </OverlayProvider>
    // </CharacterMenuProvider>
  )
}

export default Chat

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.theme2};
  display: flex;
  ${cover()};
  ${spacedChildrenHorizontal(spacing.xsmall)};
`

const RoomContainer = styled.div`
  flex: 1;
`
