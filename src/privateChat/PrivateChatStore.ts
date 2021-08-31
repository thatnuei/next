import type { CharacterStatus } from "../character/types"
import { omit } from "../common/omit"
import { truthyMap } from "../common/truthyMap"
import type { TruthyMap } from "../common/types"
import type { ChatLogger } from "../logging/logger"
import type { MessageState } from "../message/MessageState"
import {
  createPrivateMessage,
  createSystemMessage,
} from "../message/MessageState"
import { createSimpleContext } from "../react/createSimpleContext"
import {
  addRoomMessage,
  createRoomState,
  setRoomInput,
  setRoomUnread,
} from "../room/state"
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import type { SocketStore } from "../socket/SocketStore"
import { createDictStore } from "../state/dict-store"
import { createStore } from "../state/store"
import { restorePrivateChats, savePrivateChats } from "./storage"
import type { PrivateChat } from "./types"

export type PrivateChatStore = ReturnType<typeof createPrivateChatStore>

function createPrivateChat(partnerName: string): PrivateChat {
  return {
    ...createRoomState(),
    partnerName,
    typingStatus: "clear",
  }
}

function getLoggerRoomId(identity: string, partnerName: string): string {
  return `private-chat:${identity}:${partnerName}`
}

export function createPrivateChatStore(
  identity: string,
  logger: ChatLogger,
  socket: SocketStore,
) {
  const privateChats = createDictStore<PrivateChat>(createPrivateChat)
  const openChatNames = createStore<TruthyMap>({})
  let restored = false

  function addStatusSystemMessage(
    character: string,
    status: CharacterStatus,
    statusmsg = "",
  ) {
    if (openChatNames.value[character]) {
      const statusMessageSuffix = statusmsg ? `: ${statusmsg}` : ""

      privateChats.updateItem(character, (chat) =>
        addRoomMessage(
          chat,
          createSystemMessage(
            `[user]${character}[/user] is now ${status}${statusMessageSuffix}`,
          ),
        ),
      )
    }
  }

  function saveChats() {
    if (!restored) return
    savePrivateChats(identity, Object.keys(openChatNames.value))
  }

  const store = {
    privateChats,
    openChatNames,

    openChat(partnerName: string) {
      openChatNames.update((names) => ({ ...names, [partnerName]: true }))
      logger.setRoomName(getLoggerRoomId(identity, partnerName), partnerName)

      logger
        .getMessages(getLoggerRoomId(identity, partnerName), 30)
        .then((messages) => {
          privateChats.updateItem(partnerName, (chat) => ({
            ...chat,
            previousMessages: chat.previousMessages ?? messages,
          }))
        })
      saveChats()
    },

    closeChat(partnerName: string) {
      openChatNames.update((names) => omit(names, [partnerName]))
      saveChats()
    },

    addMessage(partnerName: string, message: MessageState) {
      privateChats.updateItem(partnerName, (chat) =>
        addRoomMessage(chat, message),
      )
      logger.addMessage(getLoggerRoomId(identity, partnerName), message)
    },

    sendMessage(partnerName: string, message: string) {
      const rollPrefix = "/roll"
      if (message.startsWith(rollPrefix)) {
        socket.send({
          type: "RLL",
          params: {
            recipient: partnerName,
            dice: message.slice(rollPrefix.length).trim() || "1d20",
          },
        })
        return
      }

      const bottlePrefix = "/bottle"
      if (message.startsWith(bottlePrefix)) {
        socket.send({
          type: "RLL",
          params: {
            recipient: partnerName,
            dice: "bottle",
          },
        })
        return
      }

      socket.send({
        type: "PRI",
        params: {
          recipient: partnerName,
          message,
        },
      })

      store.addMessage(partnerName, createPrivateMessage(identity, message))
    },

    setInput(partnerName: string, input: string) {
      privateChats.updateItem(partnerName, (chat) => setRoomInput(chat, input))
    },

    markRead(partnerName: string) {
      privateChats.updateItem(partnerName, (chat) => setRoomUnread(chat, false))
    },

    handleCommand(command: ServerCommand) {
      matchCommand(command, {
        IDN() {
          restorePrivateChats(identity)
            .then((names) => {
              openChatNames.set(truthyMap(names))
              restored = true
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.warn("Couldn't restore private chats", error)
            })
        },

        PRI({ character: name, message }) {
          store.openChat(name)
          store.addMessage(name, createPrivateMessage(name, message))
          privateChats.updateItem(name, (chat) => setRoomUnread(chat, true))
        },

        TPN({ character: name, status }) {
          privateChats.updateItem(name, (chat) => ({
            ...chat,
            typingStatus: status,
          }))
        },

        RLL(params) {
          if ("recipient" in params) {
            const partnerName =
              params.character === identity
                ? params.recipient
                : params.character

            store.openChat(partnerName)
            store.addMessage(partnerName, createSystemMessage(params.message))
          }
        },

        STA({ character, status, statusmsg }) {
          addStatusSystemMessage(character, status, statusmsg)
        },
        NLN({ identity, status }) {
          addStatusSystemMessage(identity, status)
        },
        FLN({ character }) {
          addStatusSystemMessage(character, "offline")
        },
      })
    },
  }

  return store
}

export const {
  Provider: PrivateChatProvider,
  useValue: usePrivateChatStore,
  useOptionalValue: useOptionalPrivateChatStore,
} = createSimpleContext<PrivateChatStore>("PrivateChatStore")
