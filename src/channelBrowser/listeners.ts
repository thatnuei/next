import { useSetRecoilState } from "recoil"
import { useChatSocketListener } from "../chat/socketContext"
import {
  privateChannelsAtom,
  publicChannelsAtom,
  useRefreshChannelBrowserAction,
} from "./state"

export function useChannelBrowserListeners() {
  const setPublicChannels = useSetRecoilState(publicChannelsAtom)
  const setPrivateChannels = useSetRecoilState(privateChannelsAtom)
  const refresh = useRefreshChannelBrowserAction()

  useChatSocketListener({
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
  })
}
