import { observable } from "mobx"
import { ChatState } from "../chat/ChatState"
import { createCommandHandler } from "../chat/commandHelpers"
import { createChatNavHelpers } from "../chatNav/state"
import { MessageListModel } from "../message/MessageListModel"
import { createStoredValue } from "../storage/createStoredValue"
import * as v from "../validation"
import { TypingStatus } from "./types"

const getStoredPrivateChats = (identity: string) =>
  createStoredValue(`privateChats:${identity}`, v.dictionary(v.array(v.string)))

export class PrivateChatModel {
  constructor(public readonly partnerName: string) {}

  messageList = new MessageListModel()

  @observable.ref typingStatus: TypingStatus = "clear"
  @observable isOpen = false
  @observable isUnread = false
}

export function createPrivateChatHelpers(state: ChatState, identity: string) {
  function save() {
    const chats = [...state.privateChats.values()].filter((chat) => chat.isOpen)

    getStoredPrivateChats(identity).update(
      (data) => {
        data[identity] = chats.map((it) => it.partnerName)
        return data
      },
      () => ({}),
    )
  }

  async function restore() {
    const data = await getStoredPrivateChats(identity)
      .get()
      .catch((error) => {
        console.warn(`error loading private chats:`, error)
        return undefined
      })

    const names = data?.[identity] || []
    for (const name of names) {
      state.privateChats.update(name, (chat) => {
        chat.isOpen = true
      })
    }
  }

  function openChat(name: string) {
    state.privateChats.update(name, (chat) => {
      chat.isOpen = true
    })
    save()
  }

  function closeChat(name: string) {
    state.privateChats.update(name, (chat) => {
      chat.isOpen = false
    })
    save()
  }

  return {
    openChat,
    closeChat,
    restore,
  }
}

export function createPrivateChatCommandHandler(
  state: ChatState,
  identity: string,
) {
  const helpers = createPrivateChatHelpers(state, identity)
  const navHelpers = createChatNavHelpers(state)

  return createCommandHandler({
    IDN() {
      helpers.restore()
    },
    PRI({ character, message }) {
      state.privateChats.update(character, (chat) => {
        chat.messageList.add(character, message, "normal", Date.now())
        helpers.openChat(character)

        if (navHelpers.currentPrivateChat !== chat) {
          chat.isUnread = true
        }
      })
    },
    TPN({ character, status }) {
      state.privateChats.update(character, (chat) => {
        chat.typingStatus = status
      })
    },
  })
}
