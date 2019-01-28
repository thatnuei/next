import React from "react"
import routePaths from "../app/routePaths"
import ChannelHeader from "../channel/ChannelHeader"
import ChannelRoute from "../channel/ChannelRoute"
import { Route, Switch } from "../router"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import Button from "../ui/Button"
import { themeColor } from "../ui/colors"
import { flexColumn, flexGrow, fullscreen } from "../ui/helpers"
import Icon from "../ui/Icon"
import SideOverlay from "../ui/SideOverlay"
import { css } from "../ui/styled"
import useOverlayState from "../ui/useOverlayState"
import ChatSidebarContent from "./ChatSidebarContent"
import useChatState from "./useChatState"

type Props = {
  account: string
  ticket: string
  identity: string
}

function ChatRoute(props: Props) {
  const { channelStore, characterStore } = useChatState(props)
  const sidebar = useOverlayState()

  return (
    <AppDocumentTitle title={props.identity}>
      <div css={[fullscreen, flexColumn]}>
        <header css={headerStyle}>
          <Button flat onClick={sidebar.open}>
            <Icon icon="menu" />
          </Button>

          <Switch>
            <Route
              path={routePaths.channel(":id")}
              render={(param) => (
                <ChannelHeader channel={channelStore.getChannel(param("id"))} />
              )}
            />
          </Switch>
        </header>

        <main css={flexGrow}>
          <Switch>
            <Route
              path={routePaths.channel(":id")}
              render={(param) => (
                <ChannelRoute
                  channel={channelStore.getChannel(param("id"))}
                  identity={props.identity}
                  characters={characterStore}
                />
              )}
            />
          </Switch>
        </main>
      </div>

      <SideOverlay {...sidebar.bind}>
        <ChatSidebarContent
          joinedChannelIds={Object.keys(channelStore.joinedChannels)}
        />
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
