import { atom } from "jotai"
import { useAtomValue, useUpdateAtom } from "jotai/utils"
import { useCallback, useMemo } from "react"
import { useChatContext } from "../chat/ChatContext"
import { omit } from "../common/omit"
import { raise } from "../common/raise"
import type { Dict, TruthyMap } from "../common/types"
import { dictionaryAtomFamily } from "../jotai/dictionaryAtomFamily"
import { useUpdateDictAtom } from "../jotai/useUpdateDictAtom"
import { useChatLogger } from "../logging/context"
import type { MessageState } from "../message/MessageState"
import { createPrivateMessage } from "../message/MessageState"
import { addRoomMessage, createRoomState, setRoomUnread } from "../room/state"
import { useIdentity } from "../user"
import type { PrivateChat } from "./types"

const privateChatDictAtom = atom<Dict<PrivateChat>>({})

const privateChatAtom = dictionaryAtomFamily(
  privateChatDictAtom,
  createPrivateChat,
)

const openChatNamesAtom = atom<TruthyMap>({})

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

function useAddPrivateChatMessage() {
  const updatePrivateChatDict = useUpdateDictAtom(
    privateChatDictAtom,
    createPrivateChat,
  )
  const logger = useChatLogger()
  const identity = useIdentity()

  return useCallback(
    (partnerName: string, message: MessageState) => {
      updatePrivateChatDict(partnerName, (chat) =>
        addRoomMessage(chat, message),
      )
      updatePrivateChatDict(partnerName, (chat) => setRoomUnread(chat, true))
      if (identity) {
        logger.addMessage(getLoggerRoomId(identity, partnerName), message)
      }
    },
    [identity, logger, updatePrivateChatDict],
  )
}

function useOpenPrivateChat() {
  const setOpenChatNames = useUpdateAtom(openChatNamesAtom)
  const updatePrivateChatDict = useUpdateDictAtom(
    privateChatDictAtom,
    createPrivateChat,
  )
  const logger = useChatLogger()
  const identity = useIdentity()

  return useCallback(
    (partnerName: string) => {
      setOpenChatNames((names) => ({ ...names, [partnerName]: true }))

      if (identity) {
        logger.setRoomName(
          getLoggerRoomId(identity, partnerName),
          `${partnerName} (on ${identity})`,
        )

        logger
          .getMessages(getLoggerRoomId(identity, partnerName), 30)
          .then((messages) => {
            updatePrivateChatDict(partnerName, (chat) => ({
              ...chat,
              previousMessages: chat.previousMessages ?? messages,
            }))
          })
      }
    },
    [identity, logger, setOpenChatNames, updatePrivateChatDict],
  )
}

export function useOpenChatNames() {
  const openChatNames = useAtomValue(openChatNamesAtom)
  return useMemo(() => Object.keys(openChatNames), [openChatNames])
}

export function usePrivateChat(partnerName: string): PrivateChat {
  return useAtomValue(privateChatAtom(partnerName))
}

export function useOpenPrivateChats(): readonly PrivateChat[] {
  const openPrivateChats = useAtomValue(privateChatDictAtom)
  return useMemo(() => Object.values(openPrivateChats), [openPrivateChats])
}

export function usePrivateChatActions(partnerName: string) {
  const { send } = useChatContext().socket
  const identity = useIdentity() ?? raise("not logged in")
  const setOpenChatNames = useUpdateAtom(openChatNamesAtom)
  const setPrivateChat = useUpdateAtom(privateChatAtom(partnerName))
  const addPrivateChatMessage = useAddPrivateChatMessage()
  const openPrivateChat = useOpenPrivateChat()

  return useMemo(
    () => ({
      open() {
        openPrivateChat(partnerName)
      },
      close() {
        setOpenChatNames((prev) => omit(prev, [partnerName]))
      },
      sendMessage(message: string) {
        if (!identity) return

        const rollPrefix = "/roll"
        if (message.startsWith(rollPrefix)) {
          send({
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
          send({
            type: "RLL",
            params: {
              recipient: partnerName,
              dice: "bottle",
            },
          })
          return
        }

        send({
          type: "PRI",
          params: {
            recipient: partnerName,
            message,
          },
        })

        addPrivateChatMessage(
          partnerName,
          createPrivateMessage(identity, message),
        )
      },
      setInput(input: string) {
        setPrivateChat((chat) => ({ ...chat, input }))
      },
      markRead() {
        setPrivateChat((chat) => setRoomUnread(chat, false))
      },
    }),
    [
      openPrivateChat,
      partnerName,
      setOpenChatNames,
      identity,
      send,
      addPrivateChatMessage,
      setPrivateChat,
    ],
  )
}
