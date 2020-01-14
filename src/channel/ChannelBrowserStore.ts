import fuzzysearch from "fuzzysearch"
import { sortBy } from "lodash"
import { computed, observable } from "mobx"
import { createCommandHandler } from "../chat/helpers"
import { SocketStore } from "../chat/SocketStore"
import queryify from "../common/helpers/queryify"

export type ChannelBrowserEntry = {
  id: string
  title: string
  userCount: number
  type: "public" | "private"
}

type SortMode = "title" | "userCount"

export class ChannelBrowserStore {
  constructor(private readonly socket: SocketStore) {}

  @observable.ref
  publicEntries: readonly ChannelBrowserEntry[] = []

  @observable.ref
  privateEntries: readonly ChannelBrowserEntry[] = []

  @observable
  sortMode: SortMode = "title"

  @observable
  searchQuery = ""

  @observable
  isRefreshing = false

  @computed
  get displayedEntries() {
    const query = queryify(this.searchQuery)

    const entryMatchesQuery = (it: ChannelBrowserEntry) =>
      fuzzysearch(query, queryify(it.title)) ||
      fuzzysearch(query, queryify(it.id))

    const processEntries = (entries: readonly ChannelBrowserEntry[] = []) => {
      const filteredEntries = entries.filter(entryMatchesQuery)
      return this.sortMode === "title"
        ? sortBy(filteredEntries, (it) => it.title.toLowerCase())
        : sortBy(filteredEntries, (it) => it.userCount).reverse()
    }

    return [
      ...processEntries(this.publicEntries),
      ...processEntries(this.privateEntries),
    ]
  }

  refresh = () => {
    if (this.isRefreshing) return

    this.isRefreshing = true
    setTimeout(() => {
      this.isRefreshing = false
    }, 7000)

    this.socket.sendCommand("CHA", undefined)
    this.socket.sendCommand("ORS", undefined)
  }

  cycleSortMode = () => {
    this.sortMode = this.sortMode === "title" ? "userCount" : "title"
  }

  setSearchQuery = (query: string) => {
    this.searchQuery = query
  }

  handleSocketCommand = createCommandHandler({
    CHA: ({ channels }) => {
      this.publicEntries = channels.map<ChannelBrowserEntry>((it) => ({
        id: it.name,
        title: it.name,
        userCount: it.characters,
        type: "public",
      }))
    },
    ORS: ({ channels }) => {
      this.privateEntries = channels.map<ChannelBrowserEntry>((it) => ({
        id: it.name,
        title: it.title,
        userCount: it.characters,
        type: "private",
      }))
    },
  })
}
