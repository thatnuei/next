import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import ChannelView from "../channel/ChannelView"
import { useChannelListeners } from "../channel/listeners"
import ChannelBrowser from "../channelBrowser/ChannelBrowser"
import { useChannelBrowserListeners } from "../channelBrowser/listeners"
import CharacterMenu from "../character/CharacterMenu"
import { useCharacterListeners } from "../character/listeners"
import ChatNav from "../chatNav/ChatNav"
import { useChatNav } from "../chatNav/state"
import { Dict } from "../common/types"
import { useMediaQuery } from "../dom/useMediaQuery"
import { usePrivateChatListeners } from "../privateChat/listeners"
import PrivateChatView from "../privateChat/PrivateChatView"
import { useStreamListener } from "../state/stream"
import { useStatusUpdateListeners } from "../statusUpdate/listeners"
import StatusUpdateForm from "../statusUpdate/StatusUpdateForm"
import Drawer from "../ui/Drawer"
import { fixedCover } from "../ui/helpers"
import LoadingOverlay from "../ui/LoadingOverlay"
import Modal from "../ui/Modal"
import { screenQueries } from "../ui/screens"
import { useChatState } from "./chatStateContext"
import NoRoomView from "./NoRoomView"
import { useChatSocket, useChatSocketConnection } from "./socketContext"
import { SocketStatus } from "./SocketHandler"
import { useChatStream } from "./streamContext"

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
  const { currentChannel, currentPrivateChat } = useChatNav()
  const isSmallScreen = useMediaQuery(screenQueries.small)

  const stream = useChatStream()
  useStreamListener(stream, (event) => {
    if (event.type === "log-out") {
      onDisconnect()
    }
  })

  const socket = useChatSocket()
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
        <div>
          <NoRoomView />
        </div>
      )}

      {isSmallScreen && (
        <Drawer state={state.sideMenuOverlay} side="left">
          <ChatNav css={tw`h-full bg-background-2`} />
        </Drawer>
      )}

      <Modal
        title="Channels"
        width={480}
        height={720}
        isVisible={state.channelBrowserOverlay.isVisible}
        onDismiss={state.channelBrowserOverlay.hide}
        children={<ChannelBrowser />}
      />

      <Modal
        title="Update Your Status"
        width={480}
        height={360}
        isVisible={state.statusUpdate.overlay.isVisible}
        onDismiss={state.statusUpdate.overlay.hide}
        children={<StatusUpdateForm />}
      />

      <CharacterMenu />

      <LoadingOverlay
        text={loadingStatuses[socket.status] || "Online!"}
        visible={socket.status in loadingStatuses}
      />
    </div>
  )
}

export default observer(Chat)
