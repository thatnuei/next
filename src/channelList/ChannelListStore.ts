import { action, observable } from "mobx"
import { RootStore } from "../app/RootStore"
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

  constructor(private rootStore: RootStore) {
    rootStore.socketStore.addCommandListener("CHA", this.handlePublicChannels)
    rootStore.socketStore.addCommandListener("ORS", this.handlePrivateChannels)
  }

  requestChannelList() {
    this.rootStore.socketStore.sendCommand("CHA", undefined)
    this.rootStore.socketStore.sendCommand("ORS", undefined)
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
