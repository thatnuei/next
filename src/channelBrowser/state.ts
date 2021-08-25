import { atom, useAtom } from "jotai"
import { atomFamily, useUpdateAtom } from "jotai/utils"
import { useCallback } from "react"
import { delay } from "../common/delay"
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import { useSocketActions, useSocketListener } from "../socket/SocketConnection"

export type ChannelBrowserChannel = {
  id: string
  title: string
  type: "public" | "private"
  userCount: number
}

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

export function useRefreshChannelBrowser() {
  const { send } = useSocketActions()
  const [isRefreshing, setIsRefreshing] = useAtom(isRefreshingAtom)

  return useCallback(async () => {
    if (isRefreshing) return

    send({ type: "CHA" })
    send({ type: "ORS" })

    // the server has a 7 second timeout on refreshes
    setIsRefreshing(true)
    await delay(7000)
    setIsRefreshing(false)
  }, [isRefreshing, send, setIsRefreshing])
}

export function usePublicChannels() {
  return useAtom(publicChannelsAtom)[0]
}

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

export function useGetChannelLink() {
  const privateChannels = usePrivateChannels()
  return useCallback(
    (channelId: string) => {
      const privateChannel = privateChannels.find((ch) => ch.id === channelId)
      return privateChannel
        ? `[session=${privateChannel.title}]${channelId}[/session]`
        : `[channel]${channelId}[/channel]`
    },
    [privateChannels],
  )
}

export function useChannelBrowserCommandListener() {
  const setPublicChannels = useUpdateAtom(publicChannelsAtom)
  const setPrivateChannels = useUpdateAtom(privateChannelsAtom)
  const refresh = useRefreshChannelBrowser()

  useSocketListener((command: ServerCommand) => {
    matchCommand(command, {
      IDN() {
        // perform a refresh so user counts are up to date
        refresh()
      },

      CHA({ channels }) {
        setPublicChannels(
          channels.map((it) => ({
            id: it.name,
            title: it.name,
            userCount: it.characters,
            type: "public",
          })),
        )
      },

      ORS({ channels }) {
        setPrivateChannels(
          channels.map((it) => ({
            id: it.name,
            title: it.title,
            userCount: it.characters,
            type: "private",
          })),
        )
      },
    })
  })
}
