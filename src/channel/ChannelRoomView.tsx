import { observe } from "mobx"
import { observer } from "mobx-react-lite"
import React, { useEffect, useRef } from "react"
import ChatSidebarContent from "../chat/ChatSidebarContent"
import MessageRow from "../message/MessageRow"
import { useRootStore } from "../RootStore"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import Button from "../ui/Button"
import { themeColor } from "../ui/colors"
import { fillArea, flexColumn, flexGrow, scrollVertical } from "../ui/helpers"
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

  const messageListRef = useRef<HTMLElement>(null)

  useBottomScroll(messageListRef, channel.messages)

  return (
    <AppDocumentTitle title={`${chatStore.identity} - ${channel.name}`}>
      <header css={headerStyle}>
        <Button flat onClick={sidebar.open}>
          <Icon icon="menu" />
        </Button>
        <ChannelHeader channel={channel} />
      </header>

      <main css={flexGrow}>
        <section css={[fillArea, flexColumn]}>
          <section css={[flexGrow, scrollVertical]} ref={messageListRef}>
            {channel.filteredMessages.slice(-300).map((message) => (
              <MessageRow key={message.id} {...message} />
            ))}
          </section>
          <form
            css={inputContainerStyle}
            onSubmit={(event) => event.preventDefault()}
          >
            <TextArea />
            <Button>Send</Button>
          </form>
        </section>
      </main>

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

function useBottomScroll(
  elementRef: React.RefObject<HTMLElement>,
  value: unknown,
) {
  useEffect(() => {
    const element = elementRef.current
    if (element) element.scrollTop = element.scrollHeight

    return observe(value as Object, () => {
      const element = elementRef.current
      if (!element) return

      const wasBottomScrolled =
        element != null &&
        element.scrollTop >= element.scrollHeight - element.clientHeight - 100

      requestAnimationFrame(() => {
        if (wasBottomScrolled) {
          element.scrollTop = element.scrollHeight
        }
      })
    })
  })
}
