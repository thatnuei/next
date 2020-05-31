import { useChatState } from "../chat/chatStateContext"
import { useChatCredentials } from "../chat/credentialsContext"
import { useChatStream } from "../chat/streamContext"
import { useChatNav, useSetViewAction } from "../chatNav/state"
import { createPrivateMessage } from "../message/MessageState"
import { useSocket, useSocketListener } from "../socket/socketContext"
import { useStreamListener } from "../state/stream"
import { createStoredValue } from "../storage/createStoredValue"
import * as v from "../validation"

const getStoredPrivateChats = (identity: string) =>
  createStoredValue(`privateChats:${identity}`, v.dictionary(v.array(v.string)))

export function usePrivateChatListeners() {
  const chatStream = useChatStream()
  const state = useChatState()
  const socket = useSocket()
  const { identity } = useChatCredentials()
  const nav = useChatNav()
  const setView = useSetViewAction()

  useStreamListener(chatStream, (event) => {
    if (event.type === "open-private-chat") {
      openChat(event.name)
      setView({ type: "privateChat", partnerName: event.name })
    }

    if (event.type === "close-private-chat") {
      state.privateChats.update(event.name, (chat) => {
        chat.isOpen = false
      })
      save()
    }

    if (event.type === "send-private-message") {
      socket.send({
        type: "PRI",
        params: { recipient: event.recipientName, message: event.text },
      })
      state.privateChats.update(event.recipientName, (chat) => {
        chat.messageList.add(createPrivateMessage(identity, event.text))
      })
    }
  })

  useSocketListener({
    IDN() {
      restore()
    },
    PRI({ character, message }) {
      state.privateChats.update(character, (chat) => {
        chat.messageList.add(createPrivateMessage(character, message))
        openChat(character)

        if (nav.currentPrivateChat !== chat) {
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

  function openChat(name: string) {
    state.privateChats.update(name, (chat) => {
      chat.isOpen = true
    })
    save()
  }

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
}
