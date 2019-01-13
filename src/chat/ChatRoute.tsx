import { Redirect, RouteComponentProps, Router } from "@reach/router"
import React, { useContext, useEffect } from "react"
import AppStore from "../app/AppStore"
import { identityStorageKey } from "../app/constants"
import routePaths from "../app/routePaths"
import ChannelHeader from "../channel/ChannelHeader"
import ChannelRoute from "../channel/ChannelRoute"
import Button from "../ui/Button"
import { appColor } from "../ui/colors"
import { flexColumn, flexGrow, fullscreen } from "../ui/helpers"
import Icon from "../ui/Icon"
import SideOverlay from "../ui/SideOverlay"
import { css } from "../ui/styled"
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

const headerStyle = css`
  display: flex;
  align-items: center;
  background-color: ${appColor};
  min-height: 50px;
`
