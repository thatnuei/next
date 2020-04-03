import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import ChannelView from "../channel/ChannelView"
import ChannelBrowser from "../channelBrowser/ChannelBrowser"
import ChatMenuButton from "../chatNav/ChatMenuButton"
import ChatNav from "../chatNav/ChatNav"
import { useChatNav } from "../chatNav/state"
import { useMediaQuery } from "../dom/useMediaQuery"
import PrivateChatView from "../privateChat/PrivateChatView"
import StatusUpdateForm from "../statusUpdate/StatusUpdateForm"
import Drawer from "../ui/Drawer"
import { fixedCover } from "../ui/helpers"
import Modal from "../ui/Modal"
import { screenQueries } from "../ui/screens"
import { useChatContext } from "./context"

function Chat() {
  const { state } = useChatContext()
  const { currentChannel, currentPrivateChat } = useChatNav()
  const isSmallScreen = useMediaQuery(screenQueries.small)

  return (
    <div css={[fixedCover, tw`flex`]}>
      {!isSmallScreen && <ChatNav css={tw`mr-gap`} />}

      {currentChannel ? (
        <ChannelView css={tw`flex-1`} channel={currentChannel} />
      ) : currentPrivateChat ? (
        <PrivateChatView css={tw`flex-1`} chat={currentPrivateChat} />
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
