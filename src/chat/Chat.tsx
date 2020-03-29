import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import ChannelView from "../channel/ChannelView"
import { useMediaQuery } from "../dom/useMediaQuery"
import { fixedCover } from "../ui/helpers"
import { screenQueries } from "../ui/screens"
import ChatMenuButton from "./ChatMenuButton"
import ChatNav from "./ChatNav"
import { useChatContext } from "./context"

function Chat() {
  const { navStore } = useChatContext()
  const isSmallScreen = useMediaQuery(screenQueries.small)

  return (
    <div css={[fixedCover, tw`flex`]}>
      {!isSmallScreen && <ChatNav css={tw`mr-gap`} />}
      {navStore.currentChannel ? (
        <ChannelView css={tw`flex-1`} channel={navStore.currentChannel} />
      ) : (
        // TODO: proper "no room" default header
        <ChatMenuButton />
      )}
    </div>
  )
}

export default observer(Chat)
