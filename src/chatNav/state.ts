import { atom, useRecoilCallback, useSetRecoilState } from "recoil"
import { sideMenuVisibleAtom } from "../chat/state"
import { privateChatAtom } from "../privateChat/state"
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

  return useRecoilCallback(
    ({ set }) => (view: ChatNavView) => {
      setView(view)
      setSideMenuVisible(false)

      if (view.type === "channel") {
        root.channelStore.getChannel(view.id).isUnread.set(false)
      } else {
        set(privateChatAtom(view.partnerName), (prev) => ({
          ...prev,
          isUnread: false,
        }))
      }
    },
    [root.channelStore, setSideMenuVisible, setView],
  )
}
