import { observer } from "mobx-react-lite"
import { cover } from "polished"
import React, { useMemo } from "react"
import ChannelView from "../channel/ChannelView"
import { CharacterMenuProvider } from "../character/CharacterMenuContext"
import { useRootStore } from "../RootStore"
import Box from "../ui/Box"
import SideOverlay from "../ui/SideOverlay"
import { gapSizes } from "../ui/theme"
import useMedia from "../ui/useMedia"
import useToggleState from "../ui/useToggleState"
import ChatNavigation from "./ChatNavigation"

const navigationBreakpoint = 950

const ChatScreen = () => {
  const { channelStore, viewStore } = useRootStore()

  const navigationVisible = useMedia(`(min-width: ${navigationBreakpoint}px)`)
  const navigationOverlay = useToggleState()

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

  const navigationOverlayContext = useMemo(
    () => ({
      isOverlayVisible: !navigationVisible,
      show: navigationOverlay.enable,
    }),
    [navigationOverlay.enable, navigationVisible],
  )

  return (
    <CharacterMenuProvider>
      <Box
        direction="row"
        gap={gapSizes.xsmall}
        style={cover()}
        background="theme2"
      >
        {navigationVisible && <ChatNavigation />}

        <NavigationOverlayContext.Provider value={navigationOverlayContext}>
          {renderChatRoom()}
        </NavigationOverlayContext.Provider>
      </Box>

      <SideOverlay
        anchor="left"
        visible={navigationOverlay.on}
        onClick={navigationOverlay.disable}
      >
        <Box elevated onClick={(e) => e.stopPropagation()}>
          <ChatNavigation />
        </Box>
      </SideOverlay>
    </CharacterMenuProvider>
  )
}
export default observer(ChatScreen)

export const NavigationOverlayContext = React.createContext({
  show: () => {},
  isOverlayVisible: false,
})
