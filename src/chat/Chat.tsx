import { AnimatePresence } from "framer-motion"
import { useObservable } from "micro-observables"
import React from "react"
import tw from "twin.macro"
import ChannelView from "../channel/ChannelView"
import ChannelBrowser from "../channelBrowser/ChannelBrowser"
import CharacterMenu from "../character/CharacterMenu"
import ChatNav from "../chatNav/ChatNav"
import { useChatNavView } from "../chatNav/helpers"
import { useMediaQuery } from "../dom/useMediaQuery"
import { Dict } from "../helpers/common/types"
import PrivateChatView from "../privateChat/PrivateChatView"
import Scope from "../react/Scope"
import { useRootStore } from "../root/context"
import { useSocket } from "../socket/socketContext"
import { SocketStatus } from "../socket/SocketHandler"
import StatusUpdateForm from "../statusUpdate/StatusUpdateForm"
import Drawer from "../ui/Drawer"
import { fixedCover } from "../ui/helpers"
import LoadingOverlay from "../ui/LoadingOverlay"
import Modal from "../ui/Modal"
import { screenQueries } from "../ui/screens"
import NoRoomView from "./NoRoomView"

export default function Chat() {
  const root = useRootStore()
  const isSideMenuVisible = useObservable(root.isSideMenuVisible)
  const isSmallScreen = useMediaQuery(screenQueries.small)

  return (
    <div css={[fixedCover, tw`flex`]}>
      {!isSmallScreen && <ChatNav css={tw`mr-gap`} />}

      <ChatRoomView />

      <AnimatePresence>
        {isSideMenuVisible && isSmallScreen && (
          <Drawer
            side="left"
            onDismiss={() => root.isSideMenuVisible.set(false)}
          >
            <ChatNav
              css={tw`h-full bg-background-2`}
              onClick={() => root.isSideMenuVisible.set(false)}
            />
          </Drawer>
        )}
      </AnimatePresence>

      <Scope>
        {function useScope() {
          const isChannelBrowserVisible = useObservable(
            root.channelBrowserStore.isVisible,
          )

          return (
            <Modal
              isVisible={isChannelBrowserVisible}
              onDismiss={root.channelBrowserStore.hide}
              title="Channels"
              width={480}
              height={720}
              children={<ChannelBrowser />}
            />
          )
        }}
      </Scope>

      <Scope>
        {function useScope() {
          const isVisible = useObservable(root.statusUpdateStore.isVisible)
          return (
            <Modal
              isVisible={isVisible}
              onDismiss={root.statusUpdateStore.hide}
              title="Update Your Status"
              width={480}
              height={360}
              children={<StatusUpdateForm />}
            />
          )
        }}
      </Scope>

      <CharacterMenu />

      <Scope>
        {function useScope() {
          const socket = useSocket()
          const status = useObservable(socket.status)

          const loadingDisplays: Dict<string, SocketStatus> = {
            connecting: "Connecting...",
            identifying: "Identifying...",
          }

          return (
            <LoadingOverlay
              text={loadingDisplays[status] || "Online!"}
              visible={status in loadingDisplays}
            />
          )
        }}
      </Scope>
    </div>
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
