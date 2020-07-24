import { useCallback } from "react"
import { atom, useSetRecoilState } from "recoil"
import { sideMenuVisibleAtom } from "../chat/state"
import { useRootStore } from "../root/context"

type ChatNavView =
  | { type: "channel"; id: string }
  | { type: "privateChat"; partnerName: string }

export const chatNavViewAtom = atom<ChatNavView | undefined>({
  key: "chatNavView",
  default: undefined,
})

export function useSetViewAction() {
  const root = useRootStore()
  const setView = useSetRecoilState(chatNavViewAtom)
  const setSideMenuVisible = useSetRecoilState(sideMenuVisibleAtom)

  return useCallback(
    (view: ChatNavView) => {
      setView(view)
      setSideMenuVisible(false)

      if (view.type === "channel") {
        root.channelStore.getChannel(view.id).isUnread.set(false)
      } else {
        root.privateChatStore.getChat(view.partnerName).isUnread.set(false)
      }
    },
    [root.channelStore, root.privateChatStore, setSideMenuVisible, setView],
  )
}
