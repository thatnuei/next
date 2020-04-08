import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import ChannelView from "../channel/ChannelView"
import { useChannelListeners } from "../channel/state"
import ChannelBrowser from "../channelBrowser/ChannelBrowser"
import { useChannelBrowserListeners } from "../channelBrowser/state"
import { useCharacterListeners } from "../character/state"
import ChatMenuButton from "../chatNav/ChatMenuButton"
import ChatNav from "../chatNav/ChatNav"
import { useChatNav } from "../chatNav/state"
import { Dict } from "../common/types"
import { useMediaQuery } from "../dom/useMediaQuery"
import { usePrivateChatListeners } from "../privateChat/listeners"
import PrivateChatView from "../privateChat/PrivateChatView"
import { useStatusUpdateListeners } from "../statusUpdate/state"
import StatusUpdateForm from "../statusUpdate/StatusUpdateForm"
import Drawer from "../ui/Drawer"
import { fixedCover } from "../ui/helpers"
import LoadingOverlay from "../ui/LoadingOverlay"
import Modal from "../ui/Modal"
import { screenQueries } from "../ui/screens"
import { useChatState } from "./chatStateContext"
import { useChatSocket, useChatSocketConnection } from "./socketContext"
import { SocketStatus } from "./SocketHandler"

type Props = {
  onDisconnect: () => void
}

function Chat({ onDisconnect }: Props) {
  useChatSocketConnection({ onDisconnect })
  useChannelListeners()
  useCharacterListeners()
  usePrivateChatListeners()
  useChannelBrowserListeners()
  useStatusUpdateListeners()

  const state = useChatState()
  const socket = useChatSocket()
  const { currentChannel, currentPrivateChat } = useChatNav()
  const isSmallScreen = useMediaQuery(screenQueries.small)

  const loadingStatuses: Dict<string, SocketStatus> = {
    connecting: "Connecting...",
    identifying: "Identifying...",
  }

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

      <LoadingOverlay
        text={loadingStatuses[socket.status] || "Online!"}
        visible={socket.status in loadingStatuses}
      />
    </div>
  )
}

export default observer(Chat)
