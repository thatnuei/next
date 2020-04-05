import { observable } from "mobx"
import { useChatState } from "../chat/chatStateContext"
import { createCommandHandler } from "../chat/commandHelpers"
import { useCommandStream } from "../chat/commandStreamContext"
import { useChatCredentials } from "../chat/credentialsContext"
import { useChatSocket } from "../chat/socketContext"
import { useChatStream } from "../chat/streamContext"
import { useChatNav } from "../chatNav/state"
import { InputModel } from "../form/InputModel"
import { MessageListModel } from "../message/MessageListModel"
import { useStreamListener } from "../state/stream"
import { createStoredValue } from "../storage/createStoredValue"
import * as v from "../validation"
import { TypingStatus } from "./types"

const getStoredPrivateChats = (identity: string) =>
  createStoredValue(`privateChats:${identity}`, v.dictionary(v.array(v.string)))

export class PrivateChatModel {
  constructor(public readonly partnerName: string) {}

  messageList = new MessageListModel()
  chatInput = new InputModel("")

  @observable.ref typingStatus: TypingStatus = "clear"
  @observable isOpen = false
  @observable isUnread = false
}

export function usePrivateChatListeners() {
  const chatStream = useChatStream()
  const commandStream = useCommandStream()
  const state = useChatState()
  const socket = useChatSocket()
  const { identity } = useChatCredentials()
  const nav = useChatNav()

  useStreamListener(chatStream, (event) => {
    if (event.type === "open-private-chat") {
      openChat(event.name)
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
        chat.messageList.add(identity, event.text, "normal", Date.now())
      })
    }
  })

  useStreamListener(
    commandStream,
    createCommandHandler({
      IDN() {
        restore()
      },
      PRI({ character, message }) {
        state.privateChats.update(character, (chat) => {
          chat.messageList.add(character, message, "normal", Date.now())
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
    }),
  )

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
