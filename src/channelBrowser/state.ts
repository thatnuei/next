import { atom, selector } from "recoil"
import { memoize } from "../common/memoize"

export type ChannelBrowserChannel = {
  id: string
  title: string
  type: "public" | "private"
  userCount: number
}

export const isChannelBrowserVisibleAtom = atom({
  key: "channelBrowser:isVisible",
  default: false,
})

export const publicChannelsAtom = atom<ChannelBrowserChannel[]>({
  key: "channelBrowser:publicChannels",
  default: [],
})

export const privateChannelsAtom = atom<ChannelBrowserChannel[]>({
  key: "channelBrowser:privateChannels",
  default: [],
})

export const canRefreshAtom = atom({
  key: "channelBrowser:canRefresh",
  default: true,
})

export const isPublicSelector = memoize((channelId: string) =>
  selector({
    key: `channelBrowser:isPublic:${channelId}`,
    get: ({ get }) => get(publicChannelsAtom).some((ch) => ch.id === channelId),
  }),
)

export const userCountSelector = memoize((channelId: string) =>
  selector({
    key: `channelBrowser:userCount:${channelId}`,
    get: ({ get }) =>
      get(publicChannelsAtom)
        .concat(get(privateChannelsAtom))
        .find((ch) => ch.id === channelId)?.userCount ?? 0,
  }),
)
