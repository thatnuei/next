import { Link, Redirect, RouteComponentProps, Router } from "@reach/router"
import React, { useContext, useEffect } from "react"
import AppStore from "../app/AppStore"
import { identityStorageKey } from "../app/constants"
import routePaths from "../app/routePaths"
import Button from "../ui/Button"
import { appColor } from "../ui/colors"
import { flexGrow, fullHeight } from "../ui/helpers"
import Icon from "../ui/Icon"
import SideOverlay from "../ui/SideOverlay"
import { css } from "../ui/styled"
import useOverlayState from "../ui/useOverlayState"

type ChatRouteProps = RouteComponentProps

function ChatRoute(props: ChatRouteProps) {
  const { user, connectToChat, channelStore } = useContext(AppStore.Context)
  const { joinedChannels } = channelStore

  useEffect(() => {
    if (!user) return

    const identity = window.sessionStorage.getItem(identityStorageKey(user.account))
    if (!identity) return

    return connectToChat(user.account, user.ticket, identity)
  }, [])

  const sidebar = useOverlayState(true)

  if (!user) return <Redirect to={routePaths.login} />

  return (
    <main css={fullHeight}>
      <header css={headerStyle}>
        <Button flat onClick={sidebar.open}>
          <Icon icon="menu" />
        </Button>

        <Router primary={false} css={{ display: "contents" }}>
          <ChannelHeader path="/channel/:id" />
        </Router>
      </header>

      <SideOverlay {...sidebar.bind}>
        <ul>
          {Object.keys(joinedChannels).map((id) => (
            <li key={id}>
              <Link to={`channel/${id}`}>{id}</Link>
            </li>
          ))}
        </ul>
      </SideOverlay>
    </main>
  )
}
export default ChatRoute

function ChannelHeader(props: RouteComponentProps<{ id: string }>) {
  const { channelStore } = useContext(AppStore.Context)
  const { getChannel } = channelStore

  if (!props.id) return null

  const channel = getChannel(props.id)
  return (
    <>
      <h2 css={flexGrow}>{channel.name}</h2>
      <Button flat>
        <Icon icon="users" />
      </Button>
    </>
  )
}

const headerStyle = css`
  display: flex;
  align-items: center;
  background-color: ${appColor};
  height: 50px;
`
