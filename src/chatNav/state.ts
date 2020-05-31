import { action, observable } from "mobx"
import { useRecoilCallback } from "recoil"
import { channelAtom } from "../channel/state"
import { ChatState } from "../chat/ChatState"
import { useChatState } from "../chat/chatStateContext"

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

  return useRecoilCallback(
    ({ set }, view: ChatNavView) => {
      state.nav.setView(view)
      state.sideMenuOverlay.hide()

      if (view.type === "channel") {
        set(channelAtom(view.id), (prev) => ({ ...prev, isUnread: false }))
      } else {
        state.privateChats.get(view.partnerName).isUnread = false
      }
    },
    [state.nav, state.privateChats, state.sideMenuOverlay],
  )
}

export function createChatNavHelpers(state: ChatState) {
  // TODO: these need to maybe be separate values/hooks,
  // and the functions should probably be recoil values or selectors
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

    setView: (view: ChatNavView) => {
      state.nav.setView(view)
      state.sideMenuOverlay.hide()

      if (view.type === "channel") {
        // state.channels.get(view.id).isUnread = false
      } else {
        state.privateChats.get(view.partnerName).isUnread = false
      }
    },
  }
}

export function useChatNav() {
  const state = useChatState()
  return createChatNavHelpers(state)
}
