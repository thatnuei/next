import { action, observable } from "mobx"
import { useLocalStore } from "mobx-react-lite"
import { ChatState } from "../chat/chat-state"
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

export function createChatNavHelpers(state: ChatState) {
  return {
    get view() {
      return state.nav.view
    },

    get currentChannel() {
      return this.view?.type === "channel"
        ? state.channels.get(this.view.id)
        : undefined
    },

    get currentPrivateChat() {
      return this.view?.type === "privateChat"
        ? state.privateChats.get(this.view.partnerName)
        : undefined
    },

    setView: (view: ChatNavView) => {
      state.nav.setView(view)
      state.sideMenuOverlay.hide()

      if (view.type === "channel") {
        state.channels.get(view.id).isUnread = false
      } else {
        state.privateChats.get(view.partnerName).isUnread = false
      }
    },
  }
}

export function useChatNav() {
  const state = useChatState()
  return useLocalStore(createChatNavHelpers, state)
}
