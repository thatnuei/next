import {
  delay,
  distinctUntilKeyChanged,
  merge,
  of,
  Subject,
  switchMap,
} from "rxjs"
import type { CharacterStatus } from "../character/types"
import { isTruthy } from "../common/isTruthy"
import type { ChatLogger } from "../logging/logger"
import type { MessageState } from "../message/MessageState"
import {
  createPrivateMessage,
  createSystemMessage,
} from "../message/MessageState"
import { addRoomMessage, createRoomState, setRoomUnread } from "../room/state"
import type { ChatSocket } from "../socket/ChatSocket"
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import { createDictStore } from "../state/dict-store"
import type { InputState } from "../state/input"
import { getInputStateValue } from "../state/input"
import type { Store } from "../state/store"
import { combineStores } from "../state/store"
import { restorePrivateChats, savePrivateChats } from "./storage"
import type { PrivateChat, TypingStatus } from "./types"

export type PrivateChatStore = ReturnType<typeof createPrivateChatStore>

function createPrivateChat(partnerName: string): PrivateChat {
  return {
    ...createRoomState(),
    partnerName,
    typingStatus: "clear",
  }
}

function getLoggerRoomId(identity: string, partnerName: string): string {
  return `private-chat:${identity.toLowerCase()}:${partnerName.toLowerCase()}`
}

export function createPrivateChatStore(
  identity: string,
  logger: ChatLogger,
  socket: ChatSocket,
) {
  const privateChats = createDictStore<PrivateChat>(createPrivateChat)
  const openChatNames = createDictStore<true>(() => true)
  let restored = false

  const typingStatusManager = createTypingStatusManager(socket)

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

    selectOpenPrivateChats(): Store<readonly PrivateChat[]> {
      return combineStores(privateChats, openChatNames).select(
        ([privateChats, openChatNames]) =>
          Object.keys(openChatNames)
            .map((name) => privateChats[name])
            .filter(isTruthy),
      )
    },

    openChat(partnerName: string) {
      openChatNames.setItem(partnerName, true)
      logger.setRoomName(
        getLoggerRoomId(identity, partnerName),
        `${partnerName} (on ${identity})`,
      )

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
      openChatNames.deleteItem(partnerName)
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

    setInput(partnerName: string, input: InputState) {
      privateChats.updateItem(partnerName, (chat) => ({ ...chat, input }))
      typingStatusManager.handleInputChange(
        partnerName,
        getInputStateValue(input),
      )
    },

    markRead(partnerName: string) {
      privateChats.updateItem(partnerName, (chat) => setRoomUnread(chat, false))
    },

    handleCommand(command: ServerCommand) {
      matchCommand(command, {
        IDN() {
          restorePrivateChats(identity)
            .then((names) => {
              for (const name of names) store.openChat(name)
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
          privateChats.updateItem(character, (chat) => ({
            ...chat,
            typingStatus: "clear",
          }))
        },
      })
    },
  }

  return store
}

function createTypingStatusManager(socket: ChatSocket) {
  type Input = { partnerName: string; input: string }
  type Output = { partnerName: string; status: TypingStatus }

  const subject = new Subject<Input>()

  subject
    .pipe(
      // using switchmap cancels the timer of the previous stream
      switchMap(({ partnerName, input }) => {
        // if the input is empty, send a clear status
        if (input.trim().length === 0) {
          return of<Output>({ partnerName, status: "clear" })
        }

        // if the input has content, send typing,
        // then send paused after a short delay
        return merge(
          of<Output>({ partnerName, status: "typing" }),
          of<Output>({ partnerName, status: "paused" }).pipe(delay(5000)),
        )
      }),
      distinctUntilKeyChanged("status"),
    )
    .subscribe(({ partnerName, status }) => {
      socket.send({
        type: "TPN",
        params: { character: partnerName, status },
      })
    })

  return {
    handleInputChange(partnerName: string, input: string) {
      subject.next({ partnerName, input })
    },
  }
}
