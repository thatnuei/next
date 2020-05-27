import { action, observable } from "mobx"
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

export function createChatNavHelpers(state: ChatState) {
  // TODO: these need to maybe be separate values/hooks,
  // and the functions should probably be recoil values or selectors
  return {
    get view() {
      return state.nav.view
    },

    get currentChannel() {
      if (this.view?.type === "channel") {
        const channel = state.channels.get(this.view.id)
        if (channel.joinState !== "absent") {
          return channel
        }
      }
      return undefined
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
        state.channels.get(view.id).isUnread = false
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
