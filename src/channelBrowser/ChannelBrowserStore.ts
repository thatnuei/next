import { delay } from "../common/delay"
import type { ChatSocket } from "../socket/ChatSocket"
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import type { Store } from "../state/store"
import { createStore } from "../state/store"
import type { ChannelBrowserChannel } from "./types"

export type ChannelBrowserStore = ReturnType<typeof createChannelBrowserStore>

export function createChannelBrowserStore(socket: ChatSocket) {
  const channels = createStore<{
    public: ChannelBrowserChannel[]
    private: ChannelBrowserChannel[]
  }>({
    public: [],
    private: [],
  })

  const isRefreshing = createStore(false)

  const store = {
    channels,
    isRefreshing,

    async refresh() {
      if (isRefreshing.value) return

      isRefreshing.set(true)

      socket.send({ type: "CHA" })
      socket.send({ type: "ORS" })

      // the server has a 7 second timeout on refreshes
      isRefreshing.set(true)
      await delay(7000)
      isRefreshing.set(false)
    },

    selectChannelInfo(channelId: string): Store<ChannelBrowserChannel> {
      return channels.select(
        (channels) =>
          channels.public.find((channel) => channel.id === channelId) ??
          channels.private.find((channel) => channel.id === channelId) ?? {
            id: channelId,
            title: channelId,
            type: "public",
            userCount: 0,
          },
      )
    },

    selectUserCount(channelId: string) {
      return channels.select((channels) => {
        const all = [...channels.public, ...channels.private]
        return all.find((channel) => channel.id === channelId)?.userCount ?? 0
      })
    },

    selectIsPublic(channelId: string) {
      return channels.select((channels) =>
        channels.public.some((c) => c.id === channelId),
      )
    },

    selectChannelLink(channelId: string) {
      return channels.select((channels) => {
        const channel = channels.public.find(
          (channel) => channel.id === channelId,
        )
        if (!channel) {
          return `[channel]${channelId}[/channel]`
        }
        return `[session=${channel.title}]${channelId}[/session]`
      })
    },

    handleCommand: (command: ServerCommand) => {
      matchCommand(command, {
        IDN() {
          // perform a refresh so user counts on channel links are up to date
          store.refresh()
        },

        CHA(params) {
          channels.mergeSet({
            public: params.channels.map((it) => ({
              id: it.name,
              title: it.name,
              userCount: it.characters,
              type: "public",
            })),
          })
        },

        ORS(params) {
          channels.mergeSet({
            private: params.channels.map((it) => ({
              id: it.name,
              title: it.title,
              userCount: it.characters,
              type: "private",
            })),
          })
        },
      })
    },
  }

  return store
}
