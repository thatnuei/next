import { useCallback } from "react"
import {
  atom,
  selectorFamily,
  useRecoilCallback,
  useSetRecoilState,
} from "recoil"
import { delay } from "../helpers/common/delay"
import { useSocket } from "../socket/socketContext"

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

export const isPublicSelector = selectorFamily({
  key: "channelBrowser:isPublic",
  get: (channelId: string) => ({ get }) =>
    get(publicChannelsAtom).some((ch) => ch.id === channelId),
})

export const userCountSelector = selectorFamily({
  key: "channelBrowser:userCount",
  get: (channelId: string) => ({ get }) =>
    get(publicChannelsAtom)
      .concat(get(privateChannelsAtom))
      .find((ch) => ch.id === channelId)?.userCount ?? 0,
})

export function useRefreshChannelBrowserAction() {
  const socket = useSocket()
  const setCanRefresh = useSetRecoilState(canRefreshAtom)

  return useRecoilCallback(
    async ({ getPromise }) => {
      const canRefresh = await getPromise(canRefreshAtom)
      if (!canRefresh) return

      socket.send({ type: "CHA" })
      socket.send({ type: "ORS" })

      // the server has a 7 second timeout on refreshes
      setCanRefresh(false)
      await delay(7000)
      setCanRefresh(true)
    },
    [setCanRefresh, socket],
  )
}

export function useOpenChannelBrowserAction() {
  const setVisible = useSetRecoilState(isChannelBrowserVisibleAtom)
  const refresh = useRefreshChannelBrowserAction()

  return useCallback(() => {
    setVisible(true)
    refresh()
  }, [refresh, setVisible])
}
