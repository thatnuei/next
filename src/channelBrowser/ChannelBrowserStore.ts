import { observable } from "micro-observables"
import { delay } from "../helpers/common/delay"
import { createBoundCommandHandler } from "../socket/commandHelpers"
import { SocketHandler } from "../socket/SocketHandler"

export type ChannelBrowserChannel = {
  id: string
  title: string
  type: "public" | "private"
  userCount: number
}

export class ChannelBrowserStore {
  readonly isVisible = observable(false)
  readonly isRefreshing = observable(false)
  readonly publicChannels = observable<ChannelBrowserChannel[]>([])
  readonly privateChannels = observable<ChannelBrowserChannel[]>([])

  constructor(private readonly socket: SocketHandler) {
    socket.commandStream.listen(this.handleCommand)

    this.isVisible.onChange((isVisible) => {
      if (isVisible) this.refresh()
    })
  }

  open = () => this.isVisible.set(true)
  close = () => this.isVisible.set(false)

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
      this.refresh()
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
