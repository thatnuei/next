import { observable } from "mobx"

export type ChannelBrowserItemInfo = {
  id: string
  title: string
  type: "public" | "private"
  userCount: number
}

export class ChannelBrowserState {
  @observable.ref publicChannels: ChannelBrowserItemInfo[] = []
  @observable.ref privateChannels: ChannelBrowserItemInfo[] = []
  @observable canRefresh = true

  isPublic = (channelId: string) =>
    this.publicChannels.some((entry) => entry.id === channelId)

  getUserCount = (id: string) =>
    [...this.publicChannels, ...this.privateChannels].find(
      (entry) => entry.id === id,
    )?.userCount ?? 0
}
