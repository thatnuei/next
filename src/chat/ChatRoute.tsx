import { Redirect, RouteComponentProps, Router } from "@reach/router"
import React, { useContext, useEffect, useRef } from "react"
import AppStore from "../app/AppStore"
import { identityStorageKey } from "../app/constants"
import routePaths from "../app/routePaths"
import ChannelHeader from "../channel/ChannelHeader"
import Button from "../ui/Button"
import { appColor } from "../ui/colors"
import { fillArea, flexColumn, flexGrow, fullscreen, scrollVertical } from "../ui/helpers"
import Icon from "../ui/Icon"
import SideOverlay from "../ui/SideOverlay"
import { css } from "../ui/styled"
import TextArea from "../ui/TextArea"
import useOverlayState from "../ui/useOverlayState"
import ChatSidebarContent from "./ChatSidebarContent"

type ChatRouteProps = RouteComponentProps

function ChatRoute(props: ChatRouteProps) {
  const { user, connectToChat } = useContext(AppStore.Context)

  useEffect(() => {
    if (!user) return

    const identity = window.sessionStorage.getItem(identityStorageKey(user.account))
    if (!identity) return

    return connectToChat(user.account, user.ticket, identity)
  }, [])

  const sidebar = useOverlayState()

  if (!user) return <Redirect to={routePaths.login} />

  return (
    <>
      <div css={[fullscreen, flexColumn]}>
        <header css={headerStyle}>
          <Button flat onClick={sidebar.open}>
            <Icon icon="menu" />
          </Button>

          <Router primary={false} css={{ display: "contents" }}>
            <ChannelHeader path={routePaths.channel(":id")} />
          </Router>
        </header>

        <main css={flexGrow}>
          <Router css={{ display: "contents" }}>
            <ChannelRoute path={routePaths.channel(":id")} />
          </Router>
        </main>
      </div>

      <SideOverlay {...sidebar.bind}>
        <ChatSidebarContent />
      </SideOverlay>
    </>
  )
}
export default ChatRoute

function useBottomScroll<E extends HTMLElement>(value: unknown) {
  const elementRef = useRef<E>(null)
  const element = elementRef.current

  const scrolledToBottom =
    element != null && element.scrollTop >= element.scrollHeight - element.clientHeight - 100

  useEffect(
    () => {
      if (!element) return
      if (scrolledToBottom) {
        element.scrollTop = element.scrollHeight
      }
    },
    [value],
  )

  return elementRef
}

function ChannelRoute(props: RouteComponentProps<{ id: string }>) {
  const { channelStore } = useContext(AppStore.Context)
  const channel = channelStore.getChannel(props.id || "")

  const bottomScrollRef = useBottomScroll<HTMLUListElement>(channel.messages)

  return (
    <section css={[fillArea, flexColumn]}>
      <ul css={[flexGrow, scrollVertical]} ref={bottomScrollRef}>
        {channel.messages.map((message, i) => (
          <li key={i}>
            {message.sender}: {message.message}
          </li>
        ))}
      </ul>
      <form css={inputContainerStyle} onSubmit={(event) => event.preventDefault()}>
        <TextArea />
        <Button>Send</Button>
      </form>
    </section>
  )
}

const inputContainerStyle = css`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 0.5rem;
  padding: 0.5rem;
  background-color: ${appColor};
`

const headerStyle = css`
  display: flex;
  align-items: center;
  background-color: ${appColor};
  height: 50px;
`
