import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import ChannelBrowser from "../channel/ChannelBrowser"
import Modal from "../ui/components/Modal"
import {
  bgMidnight,
  block,
  displayNone,
  flex,
  flex1,
  h,
  media,
  mr,
  w,
} from "../ui/helpers.new"
import { useChannelBrowserStore, useChatNavigationStore } from "./ChatContext"
import ChatRoomDisplay from "./ChatRoomDisplay"
import Navigation from "./Navigation"
import NavigationAction from "./NavigationAction"
import NavigationRooms from "./NavigationRooms"
import NoRoomHeader from "./NoRoomHeader"

type ChatOverlay = { name: "channelBrowser" }

function Chat() {
  const channelBrowserStore = useChannelBrowserStore()
  const navigationStore = useChatNavigationStore()

  // overlay state
  const [overlay, setOverlay] = useState<ChatOverlay>()

  const showChannelBrowser = () => {
    setOverlay({ name: "channelBrowser" })
    channelBrowserStore.refresh()
  }

  const clearOverlay = () => setOverlay(undefined)

  const navigationActions = (
    <>
      <NavigationAction
        title="Channels"
        icon="channels"
        onClick={showChannelBrowser}
      />
      <NavigationAction title="Update Status" icon="updateStatus" />
      <NavigationAction title="Who's Online" icon="users" />
      <NavigationAction title="About" icon="about" />
      <div css={flex1} />
      <NavigationAction title="Logout" icon="logout" />
    </>
  )

  return (
    <div css={[w("100vw"), h("100vh"), flex(), bgMidnight(900)]}>
      <nav css={[w(64), mr(1), displayNone, media.lg(block)]}>
        <Navigation actions={navigationActions}>
          <NavigationRooms />
        </Navigation>
      </nav>

      <main css={flex1}>
        {navigationStore.currentRoom ? (
          <ChatRoomDisplay room={navigationStore.currentRoom} />
        ) : (
          <NoRoomHeader />
        )}
      </main>

      <Modal
        title="Channel Browser"
        visible={overlay?.name === "channelBrowser"}
        onClose={clearOverlay}
        panelWidth={500}
        panelHeight={700}
      >
        <ChannelBrowser />
      </Modal>
    </div>
  )
}

export default observer(Chat)
