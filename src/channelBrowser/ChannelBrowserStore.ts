import { delay } from "../helpers/common/delay"
import { createBoundCommandHandler } from "../socket/helpers"
import { SocketHandler } from "../socket/SocketHandler"
import { Repository } from "../state/repository"

export type ChannelBrowserChannel = {
  id: string
  title: string
  type: "public" | "private"
  userCount: number
}

export class ChannelBrowserStore {
  private readonly state = this.repo.namespace("channelBrowser")

  readonly isVisible = this.state("isVisible", false)
  readonly isRefreshing = this.state("isRefreshing", false)
  readonly publicChannels = this.state<ChannelBrowserChannel[]>(
    "publicChannels",
    [],
  )
  readonly privateChannels = this.state<ChannelBrowserChannel[]>(
    "privateChannels",
    [],
  )

  constructor(
    private readonly repo: Repository,
    private readonly socket: SocketHandler,
  ) {
    socket.commands.subscribe(this.handleCommand)

    this.isVisible.onChange((isVisible) => {
      if (isVisible) this.refresh().catch(console.error)
    })
  }

  show = () => this.isVisible.set(true)
  hide = () => this.isVisible.set(false)

  isPublic = (channelId: string) =>
    this.publicChannels.transform((channels) =>
      channels.some((ch) => ch.id === channelId),
    )

  refresh = async () => {
    if (this.isRefreshing.get()) return

    this.socket.send({ type: "CHA" })
    this.socket.send({ type: "ORS" })

    // the server has a 7 second timeout on refreshes
    this.isRefreshing.set(true)
    await delay(7000)
    this.isRefreshing.set(false)
  }

  handleCommand = createBoundCommandHandler(this, {
    IDN() {
      this.refresh().catch(console.error)
    },

    CHA({ channels }) {
      this.publicChannels.set(
        channels.map((it) => ({
          id: it.name,
          title: it.name,
          userCount: it.characters,
          type: "public",
        })),
      )
    },

    ORS({ channels }) {
      this.privateChannels.set(
        channels.map((it) => ({
          id: it.name,
          title: it.title,
          userCount: it.characters,
          type: "private",
        })),
      )
    },
  })
}
