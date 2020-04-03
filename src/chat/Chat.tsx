import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import ChannelView from "../channel/ChannelView"
import ChannelBrowser from "../channelBrowser/ChannelBrowser"
import { useMediaQuery } from "../dom/useMediaQuery"
import Drawer from "../ui/Drawer"
import { fixedCover } from "../ui/helpers"
import Modal from "../ui/Modal"
import { screenQueries } from "../ui/screens"
import ChatMenuButton from "./ChatMenuButton"
import ChatNav from "./ChatNav"
import { useChatContext } from "./context"
import UpdateStatus from "./UpdateStatus"

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

      {isSmallScreen && (
        <Drawer model={navStore.sideMenu}>
          <ChatNav css={tw`h-full bg-background-2`} />
        </Drawer>
      )}

      <Modal
        title="Channels"
        width={480}
        height={720}
        model={navStore.channelBrowser}
        children={<ChannelBrowser />}
      />

      <Modal
        title="Update Your Status"
        width={480}
        height={360}
        model={navStore.updateStatus}
        children={
          <UpdateStatus
            initialValues={{ status: "online", statusMessage: "" }}
            onSubmit={(values) => {
              console.log(values)
              navStore.updateStatus.hide()
            }}
          />
        }
      />
    </div>
  )
}

export default observer(Chat)
