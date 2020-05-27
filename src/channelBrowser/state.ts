import { useCallback } from "react"
import { atom, selector, useRecoilCallback, useSetRecoilState } from "recoil"
import { useChatSocket } from "../chat/socketContext"
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

export function useRefreshChannelBrowserAction() {
  const socket = useChatSocket()
  const setCanRefresh = useSetRecoilState(canRefreshAtom)

  return useRecoilCallback(async ({ getPromise }) => {
    const canRefresh = await getPromise(canRefreshAtom)
    if (!canRefresh) return

    socket.send({ type: "CHA" })
    socket.send({ type: "ORS" })

    // the server has a 7 second timeout on refreshes
    setCanRefresh(false)
    setTimeout(() => {
      setCanRefresh(true)
    }, 7000)
  })
}

export function useOpenChannelBrowserAction() {
  const setVisible = useSetRecoilState(isChannelBrowserVisibleAtom)
  const refresh = useRefreshChannelBrowserAction()

  return useCallback(() => {
    setVisible(true)
    refresh()
  }, [refresh, setVisible])
}
