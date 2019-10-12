import { sortBy } from "lodash"
import { action, computed, observable, runInAction } from "mobx"
import { createCommandHandler } from "../chat/helpers"
import queryify from "../common/helpers/queryify"
import sleep from "../common/helpers/sleep"
import RootStore from "../RootStore"
import { ChannelMode } from "./types"

type SortMode = "userCount" | "title"

export type ChannelBrowserEntry = {
  id: string
  title: string
  userCount: number
  mode?: ChannelMode
  type: "public" | "private"
}

export default class ChannelBrowserStore {
  publicList = new EntryList()
  privateList = new EntryList()

  @observable
  searchQuery = ""

  @observable
  sortMode: SortMode = "userCount"

  constructor(private root: RootStore) {}

  @action
  refresh = async () => {
    if (this.isRefreshing) return

    this.root.socketStore.sendCommand("CHA", undefined)
    this.root.socketStore.sendCommand("ORS", undefined)

    this.publicList.state = "refreshing"
    this.privateList.state = "refreshing"

    await sleep(3000)

    runInAction(() => {
      this.publicList.state = "idle"
      this.privateList.state = "idle"
    })
  }

  showChannelBrowser = () => {
    this.root.chatOverlayStore.channelBrowser.show()
    this.refresh()
  }

  @action
  setSearchQuery = (query: string) => {
    this.searchQuery = query
  }

  @action
  cycleSortMode = () => {
    this.sortMode = this.sortMode === "userCount" ? "title" : "userCount"
  }

  @computed
  get isRefreshing() {
    return [this.publicList.state, this.privateList.state].every(
      (state) => state === "refreshing",
    )
  }

  @computed
  get displayedEntries() {
    const sortChannels = (entries: ChannelBrowserEntry[]) =>
      this.sortMode === "title"
        ? sortBy(entries, "title")
        : sortBy(entries, "userCount").reverse()

    const filterChannels = (entries: ChannelBrowserEntry[]) =>
      entries.filter((entry) =>
        queryify(entry.title).includes(this.searchQuery),
      )

    const processChannels = (entries: ChannelBrowserEntry[]) =>
      sortChannels(filterChannels(entries))

    return [
      ...processChannels(this.publicList.channels),
      ...processChannels(this.privateList.channels),
    ]
  }

  @action
  handleSocketCommand = createCommandHandler({
    CHA: ({ channels }) => {
      const entries = channels.map<ChannelBrowserEntry>(
        ({ name, mode, characters }) => ({
          id: name,
          title: name,
          mode,
          userCount: characters,
          type: "public",
        }),
      )

      this.publicList.channels = entries
      this.publicList.state = "idle"
    },

    ORS: ({ channels }) => {
      const entries = channels.map<ChannelBrowserEntry>(
        ({ name, title, characters }) => ({
          id: name,
          title,
          userCount: characters,
          type: "private",
        }),
      )
      this.privateList.channels = entries
      this.privateList.state = "idle"
    },
  })
}

type EntryListState = "idle" | "refreshing"

class EntryList {
  @observable.ref
  channels: ChannelBrowserEntry[] = []

  @observable
  state: EntryListState = "idle"
}
