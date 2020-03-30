import { observable } from "mobx"
import { createCommandHandler } from "../chat/commands"
import { SocketHandler } from "../chat/SocketHandler"

export type ChannelBrowserItemInfo = {
  id: string
  title: string
  type: "public" | "private"
  userCount: number
}

export class ChannelBrowserStore {
  constructor(private readonly socket: SocketHandler) {}

  @observable.ref publicChannels: ChannelBrowserItemInfo[] = []
  @observable.ref privateChannels: ChannelBrowserItemInfo[] = []
  @observable canRefresh = true

  refresh = () => {
    if (!this.canRefresh) return
    this.canRefresh = false

    this.socket.send({ type: "CHA" })
    this.socket.send({ type: "ORS" })

    // the server has an undocumented 7 second timeout on refreshes
    setTimeout(() => {
      this.canRefresh = true
    }, 7000)
  }

  handleCommand = createCommandHandler(this, {
    CHA({ channels }) {
      this.publicChannels = channels.map((it) => ({
        id: it.name,
        title: it.name,
        userCount: it.characters,
        type: "public",
      }))
    },
    ORS({ channels }) {
      this.privateChannels = channels.map((it) => ({
        id: it.name,
        title: it.title,
        userCount: it.characters,
        type: "private",
      }))
    },
  })
}
