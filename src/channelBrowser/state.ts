import { atom, useAtom } from "jotai"
import { atomFamily } from "jotai/utils"
import type { ChannelBrowserChannel } from "./types"

const publicChannelsAtom = atom<ChannelBrowserChannel[]>([])
const privateChannelsAtom = atom<ChannelBrowserChannel[]>([])
const isRefreshingAtom = atom(false)

const isPublicAtom = atomFamily((channelId: string) =>
  atom((get) => get(publicChannelsAtom).some((ch) => ch.id === channelId)),
)

const userCountAtom = atomFamily((channelId: string) =>
  atom((get) => {
    const channels = [...get(publicChannelsAtom), ...get(privateChannelsAtom)]
    return channels.find((ch) => ch.id === channelId)?.userCount ?? 0
  }),
)

export function usePrivateChannels() {
  return useAtom(privateChannelsAtom)[0]
}

export function useChannelBrowserIsRefreshing() {
  return useAtom(isRefreshingAtom)[0]
}

export function useIsPublicChannel(channelId: string) {
  return useAtom(isPublicAtom(channelId))[0]
}

export function useChannelUserCount(channelId: string) {
  return useAtom(userCountAtom(channelId))[0]
}
