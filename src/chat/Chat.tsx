import { useObserver } from "mobx-react-lite"
import React from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import tw from "twin.macro"
import ChannelView from "../channel/ChannelView"
import { useChannelListeners } from "../channel/listeners"
import ChannelBrowser from "../channelBrowser/ChannelBrowser"
import { useChannelBrowserListeners } from "../channelBrowser/listeners"
import { isChannelBrowserVisibleAtom } from "../channelBrowser/state"
import CharacterMenu from "../character/CharacterMenu"
import { useCharacterListeners } from "../character/listeners"
import ChatNav from "../chatNav/ChatNav"
import { chatNavViewAtom } from "../chatNav/state"
import { useMediaQuery } from "../dom/useMediaQuery"
import { Dict } from "../helpers/common/types"
import { usePrivateChatListeners } from "../privateChat/listeners"
import PrivateChatView from "../privateChat/PrivateChatView"
import HookScope from "../react/HookScope"
import { useSocket, useSocketConnection } from "../socket/socketContext"
import { SocketStatus } from "../socket/SocketHandler"
import { useStreamListener } from "../state/stream"
import { useStatusUpdateListeners } from "../statusUpdate/listeners"
import { statusOverlayVisibleAtom } from "../statusUpdate/state"
import StatusUpdateForm from "../statusUpdate/StatusUpdateForm"
import Drawer from "../ui/Drawer"
import { fixedCover } from "../ui/helpers"
import LoadingOverlay from "../ui/LoadingOverlay"
import Modal from "../ui/Modal"
import { screenQueries } from "../ui/screens"
import NoRoomView from "./NoRoomView"
import { sideMenuVisibleAtom } from "./state"
import { useChatStream } from "./streamContext"

type Props = {
  onDisconnect: () => void
}

function Chat({ onDisconnect }: Props) {
  useSocketConnection({ onDisconnect })
  useChannelListeners()
  useCharacterListeners()
  usePrivateChatListeners()
  useChannelBrowserListeners()
  useStatusUpdateListeners()

  const isSmallScreen = useMediaQuery(screenQueries.small)

  const stream = useChatStream()
  useStreamListener(stream, (event) => {
    if (event.type === "log-out") {
      onDisconnect()
    }
  })

  const socket = useSocket()

  const loadingStatus = useObserver(() => socket.status)

  const loadingStatuses: Dict<string, SocketStatus> = {
    connecting: "Connecting...",
    identifying: "Identifying...",
  }

  const view = useRecoilValue(chatNavViewAtom)

  const [sideMenuVisible, setSideMenuVisible] = useRecoilState(
    sideMenuVisibleAtom,
  )

  return (
    <div css={[fixedCover, tw`flex`]}>
      {!isSmallScreen && <ChatNav css={tw`mr-gap`} />}

      {view?.type === "channel" ? (
        <ChannelView css={tw`flex-1`} channelId={view.id} />
      ) : view?.type === "privateChat" ? (
        <PrivateChatView css={tw`flex-1`} partnerName={view.partnerName} />
      ) : (
        // need this extra div because of flex styling (?)
        <div>
          <NoRoomView />
        </div>
      )}

      {isSmallScreen && (
        <Drawer
          side="left"
          isVisible={sideMenuVisible}
          onDismiss={() => setSideMenuVisible(false)}
        >
          <ChatNav css={tw`h-full bg-background-2`} />
        </Drawer>
      )}

      <HookScope>
        {function useScope() {
          const [isVisible, setVisible] = useRecoilState(
            isChannelBrowserVisibleAtom,
          )
          return (
            <Modal
              title="Channels"
              width={480}
              height={720}
              isVisible={isVisible}
              onDismiss={() => setVisible(false)}
              children={<ChannelBrowser />}
            />
          )
        }}
      </HookScope>

      <HookScope>
        {function useScope() {
          const [isVisible, setVisible] = useRecoilState(
            statusOverlayVisibleAtom,
          )
          return (
            <Modal
              title="Update Your Status"
              width={480}
              height={360}
              isVisible={isVisible}
              onDismiss={() => setVisible(false)}
              children={<StatusUpdateForm />}
            />
          )
        }}
      </HookScope>

      <CharacterMenu />

      <LoadingOverlay
        text={loadingStatuses[loadingStatus] || "Online!"}
        visible={loadingStatus in loadingStatuses}
      />
    </div>
  )
}

export default Chat
