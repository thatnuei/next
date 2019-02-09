import { observer } from "mobx-react-lite"
import React from "react"
import ChatSidebarContent from "../chat/ChatSidebarContent"
import MessageList from "../message/MessageList"
import { useRootStore } from "../RootStore"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import Button from "../ui/Button"
import { themeColor } from "../ui/colors"
import { fillArea, flexColumn, flexGrow, fullscreen } from "../ui/helpers"
import Icon from "../ui/Icon"
import SideOverlay from "../ui/SideOverlay"
import { css } from "../ui/styled"
import TextArea from "../ui/TextArea"
import useOverlayState from "../ui/useOverlayState"
import ChannelHeader from "./ChannelHeader"
import ChannelModel from "./ChannelModel"

type Props = {
  channel: ChannelModel
}

function ChannelRoomView({ channel }: Props) {
  const { chatStore } = useRootStore()

  const sidebar = useOverlayState()

  return (
    <AppDocumentTitle title={`${chatStore.identity} - ${channel.name}`}>
      <div css={[fullscreen, flexColumn]}>
        <header css={headerStyle}>
          <Button flat onClick={sidebar.open}>
            <Icon icon="menu" />
          </Button>
          <ChannelHeader channel={channel} />
        </header>

        <main css={flexGrow}>
          <section css={[fillArea, flexColumn]}>
            <MessageList messages={channel.filteredMessages} />
            <form
              css={inputContainerStyle}
              onSubmit={(event) => event.preventDefault()}
            >
              <TextArea />
              <Button>Send</Button>
            </form>
          </section>
        </main>
      </div>

      <SideOverlay {...sidebar.bind}>
        <ChatSidebarContent />
      </SideOverlay>
    </AppDocumentTitle>
  )
}
export default observer(ChannelRoomView)

const inputContainerStyle = css`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 0.5rem;
  padding: 0.5rem;
  background-color: ${themeColor};
`

const headerStyle = css`
  display: flex;
  align-items: center;
  background-color: ${themeColor};
  min-height: 50px;
`
