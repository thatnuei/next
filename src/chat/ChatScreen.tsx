import { observer } from "mobx-react-lite"
import { cover } from "polished"
import React from "react"
import ChannelView from "../channel/ChannelView"
import { CharacterMenuProvider } from "../character/CharacterMenuContext"
import OverlayRenderer from "../overlay/OverlayRenderer"
import { useRootStore } from "../RootStore"
import Box from "../ui/Box"
import { gapSizes } from "../ui/theme"
import ChatNavigation from "./ChatNavigation"
import useChatNavBreakpoint from "./useChatNavBreakpoint"

const ChatScreen = () => {
  const { channelStore, viewStore } = useRootStore()
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
      <Box
        direction="row"
        gap={gapSizes.xsmall}
        style={cover()}
        background="theme2"
      >
        {navigationVisible && <ChatNavigation />}
        {renderChatRoom()}
      </Box>
      <OverlayRenderer />
    </CharacterMenuProvider>
  )
}
export default observer(ChatScreen)
