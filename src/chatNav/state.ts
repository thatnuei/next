import { action, observable } from "mobx"
import { useRecoilCallback, useSetRecoilState } from "recoil"
import { channelAtom } from "../channel/state"
import { useChatState } from "../chat/chatStateContext"
import { sideMenuVisibleAtom } from "../chat/state"

type ChatNavView =
  | { type: "channel"; id: string }
  | { type: "privateChat"; partnerName: string }

export class ChatNavState {
  @observable.ref
  view?: ChatNavView

  @action
  setView = (view: ChatNavView) => {
    this.view = view
  }
}

export function useSetViewAction() {
  const state = useChatState()
  const setSideMenuVisible = useSetRecoilState(sideMenuVisibleAtom)

  return useRecoilCallback(
    ({ set }, view: ChatNavView) => {
      state.nav.setView(view)
      setSideMenuVisible(false)

      if (view.type === "channel") {
        set(channelAtom(view.id), (prev) => ({ ...prev, isUnread: false }))
      } else {
        state.privateChats.get(view.partnerName).isUnread = false
      }
    },
    [setSideMenuVisible, state.nav, state.privateChats],
  )
}

export function useChatNav() {
  const state = useChatState()
  return {
    get view() {
      return state.nav.view
    },

    get currentPrivateChat() {
      if (this.view?.type === "privateChat") {
        const chat = state.privateChats.get(this.view.partnerName)
        if (chat.isOpen) {
          return chat
        }
      }
      return undefined
    },
  }
}
