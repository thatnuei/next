import { action, observable } from "mobx"
import { AppStore } from "../app/AppStore"
import { CommandListener } from "../socket/SocketStore"

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

  constructor(private appStore: AppStore) {
    appStore.socketEvents.listen("CHA", this.handlePublicChannels)
    appStore.socketEvents.listen("ORS", this.handlePrivateChannels)
  }

  requestChannelList() {
    this.appStore.sendCommand("CHA", undefined)
    this.appStore.sendCommand("ORS", undefined)
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
