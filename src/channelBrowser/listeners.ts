import { useRecoilState, useSetRecoilState } from "recoil"
import { createCommandHandler } from "../chat/commandHelpers"
import { useCommandStream } from "../chat/commandStreamContext"
import { useChatSocket } from "../chat/socketContext"
import { useChatStream } from "../chat/streamContext"
import { useStreamListener } from "../state/stream"
import {
  canRefreshAtom,
  isChannelBrowserVisibleAtom,
  privateChannelsAtom,
  publicChannelsAtom,
} from "./state"

export function useChannelBrowserListeners() {
  const chatStream = useChatStream()
  const commandStream = useCommandStream()
  const socket = useChatSocket()
  const setPublicChannels = useSetRecoilState(publicChannelsAtom)
  const setPrivateChannels = useSetRecoilState(privateChannelsAtom)
  const [canRefresh, setCanRefresh] = useRecoilState(canRefreshAtom)
  const setVisible = useSetRecoilState(isChannelBrowserVisibleAtom)

  useStreamListener(chatStream, (event) => {
    if (event.type === "refresh-channel-browser") {
      refresh()
    }

    if (event.type === "open-channel-browser") {
      setVisible(true)
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
    }),
  )

  function refresh() {
    if (!canRefresh) return
    setCanRefresh(false)

    socket.send({ type: "CHA" })
    socket.send({ type: "ORS" })

    // the server has a 7 second timeout on refreshes
    setTimeout(() => {
      setCanRefresh(true)
    }, 7000)
  }
}
