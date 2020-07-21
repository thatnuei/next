import { AnimatePresence } from "framer-motion"
import { useObservable } from "micro-observables"
import React from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import tw from "twin.macro"
import ChannelView from "../channel/ChannelView"
import { useChannelListeners } from "../channel/listeners"
import { joinedChannelIdsAtom } from "../channel/state"
import ChannelBrowser from "../channelBrowser/ChannelBrowser"
import CharacterMenu from "../character/CharacterMenu"
import ChatNav from "../chatNav/ChatNav"
import { chatNavViewAtom } from "../chatNav/state"
import { useMediaQuery } from "../dom/useMediaQuery"
import { Dict } from "../helpers/common/types"
import { usePrivateChatListeners } from "../privateChat/listeners"
import PrivateChatView from "../privateChat/PrivateChatView"
import { openPrivateChatPartnersAtom } from "../privateChat/state"
import Scope from "../react/Scope"
import { useRootStore } from "../root/context"
import { useSocket } from "../socket/socketContext"
import { SocketStatus } from "../socket/SocketHandler"
import StatusUpdateForm from "../statusUpdate/StatusUpdateForm"
import Drawer from "../ui/Drawer"
import { fixedCover } from "../ui/helpers"
import LoadingOverlay from "../ui/LoadingOverlay"
import Modal from "../ui/Modal"
import { useOverlayControlled } from "../ui/overlay"
import { screenQueries } from "../ui/screens"
import NoRoomView from "./NoRoomView"
import { sideMenuVisibleAtom } from "./state"

export default function Chat() {
  const root = useRootStore()

  useChannelListeners()
  usePrivateChatListeners()

  const isSmallScreen = useMediaQuery(screenQueries.small)
  const sideMenu = useOverlayControlled(useRecoilState(sideMenuVisibleAtom))

  return (
    <div css={[fixedCover, tw`flex`]}>
      {!isSmallScreen && <ChatNav css={tw`mr-gap`} />}

      <ChatRoomView />

      <AnimatePresence>
        {sideMenu.value && isSmallScreen && (
          <Drawer side="left" onDismiss={sideMenu.hide}>
            <ChatNav css={tw`h-full bg-background-2`} />
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
  const view = useRecoilValue(chatNavViewAtom)
  const joinedChannels = useRecoilValue(joinedChannelIdsAtom)
  const openChats = useRecoilValue(openPrivateChatPartnersAtom)

  if (view?.type === "channel" && joinedChannels.includes(view.id)) {
    return <ChannelView css={tw`flex-1`} channelId={view.id} />
  }

  if (view?.type === "privateChat" && openChats.includes(view.partnerName)) {
    return <PrivateChatView css={tw`flex-1`} partnerName={view.partnerName} />
  }

  return <NoRoomView css={tw`self-start`} />
}
