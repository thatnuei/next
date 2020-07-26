import { AnimatePresence, motion } from "framer-motion"
import { useObservable } from "micro-observables"
import React, { useMemo } from "react"
import tw from "twin.macro"
import ChannelView from "../channel/ChannelView"
import ChannelBrowser from "../channelBrowser/ChannelBrowser"
import { useChannelBrowserStore } from "../channelBrowser/helpers"
import CharacterMenu from "../character/CharacterMenu"
import ChatNav from "../chatNav/ChatNav"
import { useChatNavView } from "../chatNav/helpers"
import { useMediaQuery } from "../dom/useMediaQuery"
import PrivateChatView from "../privateChat/PrivateChatView"
import { useRootStore } from "../root/context"
import StatusUpdateForm from "../statusUpdate/StatusUpdateForm"
import { fadeAnimation } from "../ui/animation"
import Drawer from "../ui/Drawer"
import { fixedCover } from "../ui/helpers"
import Modal from "../ui/Modal"
import { screenQueries } from "../ui/screens"
import NoRoomView from "./NoRoomView"

export default function Chat() {
  const root = useRootStore()
  const channelBrowserStore = useChannelBrowserStore()

  const isSideMenuVisible = useObservable(root.chatNavStore.sideMenu.isVisible)
  const isChannelBrowserVisible = useObservable(channelBrowserStore.isVisible)
  const isStatusUpdateVisible = useObservable(root.statusUpdateStore.isVisible)
  const isSmallScreen = useMediaQuery(screenQueries.small)
  const chatRoomView = useMemo(() => <ChatRoomView />, [])

  return (
    <motion.div css={[fixedCover, tw`flex`]} {...fadeAnimation}>
      {!isSmallScreen && <ChatNav css={tw`mr-gap`} />}

      {chatRoomView}

      <AnimatePresence>
        {isSmallScreen && isSideMenuVisible && (
          <Drawer
            key="sideMenu"
            side="left"
            onDismiss={root.chatNavStore.sideMenu.hide}
          >
            <ChatNav css={tw`h-full bg-background-2`} />
          </Drawer>
        )}

        {isChannelBrowserVisible && (
          <Modal
            key="channelBrowser"
            onDismiss={channelBrowserStore.hide}
            title="Channels"
            width={480}
            height={720}
            children={<ChannelBrowser />}
          />
        )}

        {isStatusUpdateVisible && (
          <Modal
            key="statusUpdate"
            onDismiss={root.statusUpdateStore.hide}
            title="Update Your Status"
            width={480}
            height={360}
            children={<StatusUpdateForm />}
          />
        )}
      </AnimatePresence>

      <CharacterMenu />
    </motion.div>
  )
}

function ChatRoomView() {
  const root = useRootStore()
  const view = useChatNavView()

  const isChannelJoined = useObservable(
    root.channelStore.isJoined(view.channelId ?? ""),
  )

  const isPrivateChatOpen = useObservable(
    root.privateChatStore.isOpen(view.privateChatPartner ?? ""),
  )

  if (view.channelId && isChannelJoined) {
    return <ChannelView css={tw`flex-1`} channelId={view.channelId} />
  }

  if (view.privateChatPartner && isPrivateChatOpen) {
    return (
      <PrivateChatView css={tw`flex-1`} partnerName={view.privateChatPartner} />
    )
  }

  return <NoRoomView css={tw`self-start`} />
}
