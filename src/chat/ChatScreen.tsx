import { Box } from "grommet"
import { observer } from "mobx-react-lite"
import { cover } from "polished"
import React, { useMemo } from "react"
import ChannelView from "../channel/ChannelView"
import { CharacterMenuProvider } from "../character/CharacterMenuContext"
import { useRootStore } from "../RootStore"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import SideOverlay from "../ui/SideOverlay"
import { ThemeColor } from "../ui/theme"
import useMedia from "../ui/useMedia"
import useToggleState from "../ui/useToggleState"
import ChatNavigation from "./ChatNavigation"

const navigationBreakpoint = 950

const ChatScreen = () => {
  const { chatStore, channelStore, viewStore } = useRootStore()

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
    <AppDocumentTitle title={chatStore.identity}>
      <CharacterMenuProvider>
        <Box
          direction="row"
          gap="xsmall"
          style={cover()}
          background={ThemeColor.bgDivision}
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
          <Box elevation="large" onClick={(e) => e.stopPropagation()}>
            <ChatNavigation />
          </Box>
        </SideOverlay>
      </CharacterMenuProvider>
    </AppDocumentTitle>
  )
}
export default observer(ChatScreen)

export const NavigationOverlayContext = React.createContext({
  show: () => {},
  isOverlayVisible: false,
})
