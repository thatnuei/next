import React, { useContext, useEffect } from "react"
import AppStore from "../app/AppStore"
import routePaths from "../app/routePaths"
import ChannelHeader from "../channel/ChannelHeader"
import ChannelRoute from "../channel/ChannelRoute"
import { Redirect, Route, Switch } from "../router"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import Button from "../ui/Button"
import { themeColor } from "../ui/colors"
import { flexColumn, flexGrow, fullscreen } from "../ui/helpers"
import Icon from "../ui/Icon"
import SideOverlay from "../ui/SideOverlay"
import { css } from "../ui/styled"
import useOverlayState from "../ui/useOverlayState"
import ChatSidebarContent from "./ChatSidebarContent"

function ChatRoute() {
  const { user, identity, connectToChat } = useContext(AppStore.Context)

  useEffect(() => {
    if (!user || !identity) return
    return connectToChat(user.account, user.ticket, identity)
  }, [])

  const sidebar = useOverlayState()

  if (!user) return <Redirect to={routePaths.login} />

  return (
    <AppDocumentTitle title={identity}>
      <div css={[fullscreen, flexColumn]}>
        <header css={headerStyle}>
          <Button flat onClick={sidebar.open}>
            <Icon icon="menu" />
          </Button>

          <Switch>
            <Route path={routePaths.channel(":id")} children={<ChannelHeader />} />
          </Switch>
        </header>

        <main css={flexGrow}>
          <Switch>
            <Route path={routePaths.channel(":id")} children={<ChannelRoute />} />
          </Switch>
        </main>
      </div>

      <SideOverlay {...sidebar.bind}>
        <ChatSidebarContent />
      </SideOverlay>
    </AppDocumentTitle>
  )
}
export default ChatRoute

const headerStyle = css`
  display: flex;
  align-items: center;
  background-color: ${themeColor};
  min-height: 50px;
`
