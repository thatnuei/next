import { observable } from "mobx"
import { ChatState } from "../chat/ChatState"
import { createCommandHandler } from "../chat/commandHelpers"
import { useChatContext } from "../chat/context"
import { SocketHandler } from "../chat/SocketHandler"

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
}

export function createChannelBrowserCommandHandler(state: ChatState) {
  return createCommandHandler({
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
  })
}

export function createChannelBrowserActions(
  state: ChatState,
  socket: SocketHandler,
) {
  function refresh() {
    if (!state.channelBrowser.canRefresh) return
    state.channelBrowser.canRefresh = false

    socket.send({ type: "CHA" })
    socket.send({ type: "ORS" })

    // the server has an undocumented 7 second timeout on refreshes
    setTimeout(() => {
      state.channelBrowser.canRefresh = true
    }, 7000)
  }

  function openChannelBrowser() {
    state.channelBrowserOverlay.show()
    refresh()
  }

  return {
    refresh,
    openChannelBrowser,
  }
}

export function useChannelBrowserActions() {
  const { state, socket } = useChatContext()
  return createChannelBrowserActions(state, socket)
}
