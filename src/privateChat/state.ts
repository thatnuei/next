import { union, uniq, without } from "lodash/fp"
import { useCallback } from "react"
import { atom, atomFamily, useRecoilCallback, useRecoilState } from "recoil"
import { useChatCredentials } from "../chat/helpers"
import { useSetViewAction } from "../chatNav/state"
import { createPrivateMessage, MessageState } from "../message/MessageState"
import { useSocket } from "../socket/socketContext"
import { savePrivateChats } from "./storage"
import { TypingStatus } from "./types"

export type PrivateChatState = {
  partnerName: string
  isUnread: boolean
  typingStatus: TypingStatus
}

export const privateChatAtom = atomFamily({
  key: "privateChat",
  default: (partnerName: string): PrivateChatState => ({
    partnerName,
    isUnread: false,
    typingStatus: "clear",
  }),
})

export const privateChatInputAtom = atomFamily({
  key: "privateChatInput",
  default: (_partnerName: string) => "",
})

export const privateChatMessagesAtom = atomFamily({
  key: "privateChatMessages",
  default: (_partnerName: string): MessageState[] => [],
})

export const openPrivateChatPartnersAtom = atom<string[]>({
  key: "openPrivateChats",
  default: [],
})

export function useSendPrivateMessageAction() {
  const socket = useSocket()
  const { identity } = useChatCredentials()

  return useRecoilCallback(
    ({ set }) => (recipientName: string, text: string) => {
      socket.send({
        type: "PRI",
        params: { recipient: recipientName, message: text },
      })

      set(
        privateChatMessagesAtom(recipientName),
        union([createPrivateMessage(identity, text)]),
      )
    },
    [identity, socket],
  )
}

export function useOpenPrivateChatAction() {
  const [openChats, setOpenChats] = useRecoilState(openPrivateChatPartnersAtom)
  const { identity } = useChatCredentials()

  return useCallback(
    (partnerName: string) => {
      const newChats = uniq([...openChats, partnerName])
      setOpenChats(newChats)
      savePrivateChats(identity, newChats)
    },
    [identity, openChats, setOpenChats],
  )
}

export function useOpenAndShowPrivateChatAction() {
  const openChat = useOpenPrivateChatAction()
  const setView = useSetViewAction()

  return useCallback(
    (partnerName: string) => {
      openChat(partnerName)
      setView({ type: "privateChat", partnerName })
    },
    [openChat, setView],
  )
}

export function useClosePrivateChatAction() {
  const [openChats, setOpenChats] = useRecoilState(openPrivateChatPartnersAtom)
  const { identity } = useChatCredentials()

  return useCallback(
    (partnerName: string) => {
      const newChats = without([partnerName], openChats)
      setOpenChats(newChats)
      savePrivateChats(identity, newChats)
    },
    [identity, openChats, setOpenChats],
  )
}
