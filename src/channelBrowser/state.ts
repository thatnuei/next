import { observable } from "mobx"
import { useChatState } from "../chat/chatStateContext"
import { createCommandHandler } from "../chat/commandHelpers"
import { useCommandStream } from "../chat/commandStreamContext"
import { useChatSocket } from "../chat/socketContext"
import { useChatStream } from "../chat/streamContext"
import { useStreamListener } from "../state/stream"

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
}

export function useChannelBrowserListeners() {
  const chatStream = useChatStream()
  const commandStream = useCommandStream()
  const state = useChatState()
  const socket = useChatSocket()

  useStreamListener(chatStream, (event) => {
    if (event.type === "refresh-channel-browser") {
      refresh()
    }

    if (event.type === "open-channel-browser") {
      state.channelBrowserOverlay.show()
      refresh()
    }
  })

  useStreamListener(
    commandStream,
    createCommandHandler({
      IDN() {
        refresh()
      },

      CHA({ channels }) {
        state.channelBrowser.publicChannels = channels.map((it) => ({
          id: it.name,
          title: it.name,
          userCount: it.characters,
          type: "public",
        }))
      },

      ORS({ channels }) {
        state.channelBrowser.privateChannels = channels.map((it) => ({
          id: it.name,
          title: it.title,
          userCount: it.characters,
          type: "private",
        }))
      },
    }),
  )

  function refresh() {
    if (!state.channelBrowser.canRefresh) return
    state.channelBrowser.canRefresh = false

    socket.send({ type: "CHA" })
    socket.send({ type: "ORS" })

    // the server has a 7 second timeout on refreshes
    setTimeout(() => {
      state.channelBrowser.canRefresh = true
    }, 7000)
  }
}
