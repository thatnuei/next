import React, { useEffect } from "react"
import routePaths from "../app/routePaths"
import ChannelHeader from "../channel/ChannelHeader"
import ChannelRoute from "../channel/ChannelRoute"
import useChannelStore from "../channel/useChannelStore"
import useCharacterStore from "../character/useCharacterStore"
import { OptionalArg } from "../common/types"
import { chatServerUrl } from "../fchat/constants"
import createCommandHandler from "../fchat/createCommandHandler"
import { ClientCommandMap, ServerCommand } from "../fchat/types"
import { Route, Switch, useRouter } from "../router"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import Button from "../ui/Button"
import { themeColor } from "../ui/colors"
import { flexColumn, flexGrow, fullscreen } from "../ui/helpers"
import Icon from "../ui/Icon"
import SideOverlay from "../ui/SideOverlay"
import { css } from "../ui/styled"
import useOverlayState from "../ui/useOverlayState"
import ChatSidebarContent from "./ChatSidebarContent"

type Props = {
  account: string
  ticket: string
  identity: string
}

function ChatRoute(props: Props) {
  const { history } = useRouter()
  const characterStore = useCharacterStore()
  const channelStore = useChannelStore(props.identity)

  useEffect(() => {
    const socket = new WebSocket(chatServerUrl)

    const handleCommand = createCommandHandler({
      IDN() {
        sendCommand(socket, "JCH", { channel: "Frontpage" })
        sendCommand(socket, "JCH", { channel: "Fantasy" })
        sendCommand(socket, "JCH", { channel: "Story Driven LFRP" })
        sendCommand(socket, "JCH", { channel: "Development" })
      },

      PIN() {
        sendCommand(socket, "PIN")
      },

      HLO({ message }) {
        console.info(message)
      },

      CON({ count }) {
        console.info(`There are ${count} characters in chat`)
      },
    })

    socket.onopen = () => {
      sendCommand(socket, "IDN", {
        account: props.account,
        ticket: props.ticket,
        character: props.identity,
        cname: "next",
        cversion: "0.1.0",
        method: "ticket",
      })
    }

    socket.onclose = () => {
      console.log("socket closed")
      history.push(routePaths.login)
    }

    socket.onmessage = ({ data }) => {
      const type = data.slice(0, 3)
      const params = data.length > 3 ? JSON.parse(data.slice(4)) : {}
      const command: ServerCommand = { type, params }

      if (handleCommand(command)) return
      if (characterStore.handleCommand(command)) return
      if (channelStore.handleCommand(command)) return

      console.log("unhandled command", command)
    }

    return () => {
      socket.onopen = null
      socket.onclose = null
      socket.onmessage = null
      socket.close()
    }
  }, [])

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

function sendCommand<K extends keyof ClientCommandMap>(
  socket: WebSocket,
  command: K,
  ...params: OptionalArg<ClientCommandMap[K]>
) {
  if (params[0]) {
    socket.send(`${command} ${JSON.stringify(params[0])}`)
  } else {
    socket.send(command)
  }
}
