import { atom, useRecoilCallback, useSetRecoilState } from "recoil"
import { channelAtom } from "../channel/state"
import { sideMenuVisibleAtom } from "../chat/state"
import { privateChatAtom } from "../privateChat/state"

type ChatNavView =
  | { type: "channel"; id: string }
  | { type: "privateChat"; partnerName: string }

export const chatNavViewAtom = atom<ChatNavView | undefined>({
  key: "chatNavView",
  default: undefined,
})

export function useSetViewAction() {
  const setView = useSetRecoilState(chatNavViewAtom)
  const setSideMenuVisible = useSetRecoilState(sideMenuVisibleAtom)

  return useRecoilCallback(
    ({ set }) => (view: ChatNavView) => {
      setView(view)
      setSideMenuVisible(false)

      if (view.type === "channel") {
        set(channelAtom(view.id), (prev) => ({ ...prev, isUnread: false }))
      } else {
        set(privateChatAtom(view.partnerName), (prev) => ({
          ...prev,
          isUnread: false,
        }))
      }
    },
    [setSideMenuVisible, setView],
  )
}
