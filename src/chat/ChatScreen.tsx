import { useObserver } from "mobx-react-lite"
import React from "react"
import ChannelHeader from "../channel/ChannelHeader"
import ChannelRoomView from "../channel/ChannelRoomView"
import { useRootStore } from "../RootStore"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import Button from "../ui/Button"
import { themeColor } from "../ui/colors"
import { flexColumn, flexGrow, fullscreen } from "../ui/helpers"
import Icon from "../ui/Icon"
import SideOverlay from "../ui/SideOverlay"
import { css } from "../ui/styled"
import useOverlayState from "../ui/useOverlayState"
import ChatSidebarContent from "./ChatSidebarContent"

function ChatScreen() {
  const { chatStore } = useRootStore()
  const sidebar = useOverlayState()

  return (
    <AppDocumentTitle title={chatStore.identity}>
      <div css={[fullscreen, flexColumn]}>
        <header css={headerStyle}>
          <Button flat onClick={sidebar.open}>
            <Icon icon="menu" />
          </Button>
          <ChatHeader />
        </header>

        <main css={flexGrow}>
          <ChatRoomView />
        </main>
      </div>

      <SideOverlay {...sidebar.bind}>
        <ChatSidebarContent />
      </SideOverlay>
    </AppDocumentTitle>
  )
}
export default ChatScreen

function ChatHeader() {
  const { viewStore } = useRootStore()

  return useObserver(() => {
    switch (viewStore.screen) {
      case "console":
        return <p>todo: console</p>
      case "channel":
        return <ChannelHeader channel={viewStore.currentChannel} />
      case "privateChat":
        return <p>todo: private chat</p>
    }

    return <p>view not found</p>
  })
}

function ChatRoomView() {
  const { viewStore } = useRootStore()

  return useObserver(() => {
    switch (viewStore.screen) {
      case "console":
        return <p>todo: console</p>
      case "channel":
        return <ChannelRoomView channel={viewStore.currentChannel} />
      case "privateChat":
        return <p>todo: private chat</p>
    }

    return <p>view not found</p>
  })
}

const headerStyle = css`
  display: flex;
  align-items: center;
  background-color: ${themeColor};
  min-height: 50px;
`
