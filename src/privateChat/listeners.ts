import { union } from "lodash/fp"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { useChatCredentials } from "../chat/credentialsContext"
import { chatNavViewAtom } from "../chatNav/state"
import { createPrivateMessage } from "../message/MessageState"
import { useRecoilSet } from "../recoil/helpers"
import { useSocketListener } from "../socket/socketContext"
import {
  openPrivateChatPartnersAtom,
  privateChatAtom,
  privateChatMessagesAtom,
  useOpenPrivateChatAction,
} from "./state"
import { restorePrivateChats } from "./storage"

export function usePrivateChatListeners() {
  const { identity } = useChatCredentials()
  const setOpenChats = useSetRecoilState(openPrivateChatPartnersAtom)
  const set = useRecoilSet()
  const navView = useRecoilValue(chatNavViewAtom)
  const openChat = useOpenPrivateChatAction()

  useSocketListener({
    IDN() {
      restorePrivateChats(identity)
        .then(setOpenChats)
        .catch((error) => {
          console.error("Could not restore private chats", error)
        })
    },
    PRI({ character, message }) {
      openChat(character)

      set(
        privateChatMessagesAtom(character),
        union([createPrivateMessage(character, message)]),
      )

      const isCurrent =
        navView?.type === "privateChat" && navView.partnerName === character

      if (!isCurrent) {
        set(privateChatAtom(character), (prev) => ({ ...prev, isUnread: true }))
      }
    },
    TPN({ character, status }) {
      set(privateChatAtom(character), (prev) => ({
        ...prev,
        typingStatus: status,
      }))
    },
  })
}
