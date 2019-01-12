import { mdiConsole, mdiEarth } from "@mdi/js"
import { action, computed, observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { ChannelModel } from "../channel/ChannelModel"
import { PrivateChatModel } from "../privateChat/PrivateChatModel"
import { ServerCommand, SocketHandler } from "../socket/SocketHandler"
import { ChatNavigationTab } from "./ChatNavigationTab"
import { ChatViewModel } from "./ChatViewModel"

type ChatRoute =
  | { key: string; type: "channel"; channel: ChannelModel }
  | { key: string; type: "privateChat"; privateChat: PrivateChatModel }
  | { key: string; type: "console" }

export type ChatProps = {
  account: string
  ticket: string
  character: string
  onDisconnect: () => void
}

@observer
export class Chat extends React.Component<ChatProps> {
  private socket = new SocketHandler()
  private viewModel = new ChatViewModel()

  @observable.ref
  private currentRoute: ChatRoute = { key: "console", type: "console" }

  @computed
  private get routes(): ChatRoute[] {
    const channelRoutes = [...this.viewModel.joinedChannels.keys()]
      .map((id) => this.viewModel.channels.get(id))
      .filter((channel): channel is ChannelModel => channel != null)
      .map<ChatRoute>((channel) => ({
        key: `channel-${channel.title}`,
        type: "channel",
        channel,
      }))

    const privateChatRoutes = [...this.viewModel.privateChats.values()].map<ChatRoute>(
      (privateChat) => ({
        key: `privateChat-${privateChat.partner}`,
        type: "privateChat",
        privateChat,
      }),
    )

    return [{ key: "console", type: "console" }, ...channelRoutes, ...privateChatRoutes]
  }

  @action
  private setRoute = (route: ChatRoute) => {
    this.currentRoute = route
  }

  private handleCommand = (command: ServerCommand) => {
    this.viewModel.handleSocketCommand(command)

    if (command.type === "IDN") {
      this.socket.sendCommand("JCH", { channel: "Fantasy" })
      this.socket.sendCommand("JCH", { channel: "Frontpage" })
      this.socket.sendCommand("JCH", { channel: "Story Driven LFRP" })
      this.socket.sendCommand("JCH", { channel: "Development" })
    }
  }

  componentDidMount() {
    const { account, ticket, character } = this.props

    this.socket.connect({
      account,
      ticket,
      character,
      onCommand: this.handleCommand,
      onDisconnect: this.props.onDisconnect,
    })
  }

  componentWillUnmount() {
    this.socket.disconnect()
  }

  private renderRouteTab = (route: ChatRoute) => {
    const tabProps = {
      key: route.key,
      active: this.currentRoute === route,
      onActivate: () => this.setRoute(route),
    }

    switch (route.type) {
      case "channel":
        return <ChatNavigationTab text={route.channel.title} icon={mdiEarth} {...tabProps} />

      case "privateChat":
        const { partner } = route.privateChat
        return <ChatNavigationTab text={partner} avatar={partner} {...tabProps} />

      case "console":
        return <ChatNavigationTab text="Console" icon={mdiConsole} {...tabProps} />
    }
  }

  private renderConversation = () => {
    const route = this.currentRoute
    switch (route.type) {
      case "channel":
        return <div>{route.channel.title}</div>

      case "privateChat":
        return <div>{route.privateChat.partner}</div>

      case "console":
        return <div>console</div>
    }
  }

  render() {
    return (
      <main>
        <aside>{this.routes.map(this.renderRouteTab)}</aside>
        <section>{this.renderConversation()}</section>
      </main>
    )
  }
}
