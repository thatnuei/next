import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import ChannelView from "../channel/ChannelView"
import ChannelBrowser from "../channelBrowser/ChannelBrowser"
import { useMediaQuery } from "../dom/useMediaQuery"
import StatusUpdateForm from "../statusUpdate/StatusUpdateForm"
import Drawer from "../ui/Drawer"
import { fixedCover } from "../ui/helpers"
import Modal from "../ui/Modal"
import { screenQueries } from "../ui/screens"
import ChatMenuButton from "./ChatMenuButton"
import ChatNav from "./ChatNav"
import { useChatContext } from "./context"
import { useNavState } from "../chatNav/state"

function Chat() {
  const { state } = useChatContext()
  const { currentChannel } = useNavState()
  const isSmallScreen = useMediaQuery(screenQueries.small)

  return (
    <div css={[fixedCover, tw`flex`]}>
      {!isSmallScreen && <ChatNav css={tw`mr-gap`} />}

      {currentChannel ? (
        <ChannelView css={tw`flex-1`} channel={currentChannel} />
      ) : (
        // TODO: proper "no room" default header
        <ChatMenuButton />
      )}

      {isSmallScreen && (
        <Drawer model={state.sideMenuOverlay}>
          <ChatNav css={tw`h-full bg-background-2`} />
        </Drawer>
      )}

      <Modal
        title="Channels"
        width={480}
        height={720}
        model={state.channelBrowserOverlay}
        children={<ChannelBrowser />}
      />

      <Modal
        title="Update Your Status"
        width={480}
        height={360}
        model={state.statusUpdate.overlay}
        children={<StatusUpdateForm />}
      />
    </div>
  )
}

export default observer(Chat)
