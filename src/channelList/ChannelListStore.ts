import { action, observable } from "mobx"
import { CommandListener, socketStore } from "../socket/SocketStore"

export type ChannelListData = {
  id: string
  title: string
  userCount: number
}

export class ChannelListStore {
  @observable
  publicChannels: ChannelListData[] = []

  @observable
  privateChannels: ChannelListData[] = []

  constructor() {
    socketStore.addCommandListener("CHA", this.handlePublicChannels)
    socketStore.addCommandListener("ORS", this.handlePrivateChannels)
  }

  requestChannelList() {
    socketStore.sendCommand("CHA", undefined)
    socketStore.sendCommand("ORS", undefined)
  }

  @action
  private handlePublicChannels: CommandListener<"CHA"> = (params) => {
    const channelData = params.channels.map(
      (data): ChannelListData => ({
        id: data.name,
        title: data.name,
        userCount: data.characters,
      }),
    )

    this.publicChannels.splice(0)
    this.publicChannels.push(...channelData)
  }

  @action
  private handlePrivateChannels: CommandListener<"ORS"> = (params) => {
    const channelData = params.channels.map(
      (data): ChannelListData => ({
        id: data.name,
        title: data.title,
        userCount: data.characters,
      }),
    )

    this.privateChannels.splice(0)
    this.privateChannels.push(...channelData)
  }
}

export const channelListStore = new ChannelListStore()
