import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import ChannelView from "../channel/ChannelView"
import Button from "../dom/Button"
import { useMediaQuery } from "../dom/useMediaQuery"
import { fadedButton } from "../ui/components"
import { fixedCover } from "../ui/helpers"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import { screenQueries } from "../ui/screens"
import ChatNav from "./ChatNav"
import { useChatContext } from "./context"

function Chat() {
  const { navStore } = useChatContext()
  const isSmallScreen = useMediaQuery(screenQueries.small)

  const menuButton = isSmallScreen && (
    <Button title="Show side menu" css={[fadedButton, tw`mr-3`]}>
      <Icon which={icons.menu} />
    </Button>
  )

  return (
    <div css={[fixedCover, tw`flex`]}>
      {!isSmallScreen && <ChatNav css={tw`mr-gap`} />}
      {navStore.currentChannel && (
        <ChannelView
          css={tw`flex-1`}
          channel={navStore.currentChannel}
          menuButton={menuButton}
        />
      )}
    </div>
  )
}

export default observer(Chat)
