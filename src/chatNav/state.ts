import {
  atom,
  useRecoilCallback,
  useRecoilValue,
  useSetRecoilState,
} from "recoil"
import { channelAtom } from "../channel/state"
import { useChatState } from "../chat/chatStateContext"
import { sideMenuVisibleAtom } from "../chat/state"

type ChatNavView =
  | { type: "channel"; id: string }
  | { type: "privateChat"; partnerName: string }

export const chatNavViewAtom = atom<ChatNavView | undefined>({
  key: "chatNavView",
  default: undefined,
})

export function useSetViewAction() {
  const state = useChatState()
  const setView = useSetRecoilState(chatNavViewAtom)
  const setSideMenuVisible = useSetRecoilState(sideMenuVisibleAtom)

  return useRecoilCallback(
    ({ set }, view: ChatNavView) => {
      setView(view)
      setSideMenuVisible(false)

      if (view.type === "channel") {
        set(channelAtom(view.id), (prev) => ({ ...prev, isUnread: false }))
      } else {
        state.privateChats.get(view.partnerName).isUnread = false
      }
    },
    [setSideMenuVisible, setView, state.privateChats],
  )
}

export function useChatNav() {
  const state = useChatState()
  const view = useRecoilValue(chatNavViewAtom)
  return {
    get currentPrivateChat() {
      if (view?.type === "privateChat") {
        const chat = state.privateChats.get(view.partnerName)
        if (chat.isOpen) {
          return chat
        }
      }
      return undefined
    },
  }
}
