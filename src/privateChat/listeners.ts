import { union } from "lodash/fp"
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from "recoil"
import { useChatCredentials } from "../chat/helpers"
import { chatNavViewAtom } from "../chatNav/state"
import { createPrivateMessage } from "../message/MessageState"
import { runCommand } from "../socket/commandHelpers"
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
  const navView = useRecoilValue(chatNavViewAtom)
  const openChat = useOpenPrivateChatAction()

  useSocketListener(
    useRecoilCallback(({ set }) => (command) => {
      return runCommand(command, {
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
            set(privateChatAtom(character), (prev) => ({
              ...prev,
              isUnread: true,
            }))
          }
        },
        TPN({ character, status }) {
          set(privateChatAtom(character), (prev) => ({
            ...prev,
            typingStatus: status,
          }))
        },
      })
    }),
  )
}
