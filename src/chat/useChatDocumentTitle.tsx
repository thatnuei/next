import { useEffect } from "react"
import type { Falsy } from "../common/types"
import { useNotificationList } from "../notifications/state"
import { useStoreValue } from "../state/store"
import { useChatContext } from "./ChatContext"

export function useChatDocumentTitle() {
  const context = useChatContext()

  const unreadChatCount = useStoreValue(
    context.privateChatStore
      .selectOpenPrivateChats()
      .select((chats) => chats.filter((chat) => chat.isUnread).length),
  )

  const notifications = useNotificationList()
  const unreadNotifications = notifications
    .filter((n) => n.readStatus === "unread")
    .filter((n) => n.type === "invite" || n.type === "broadcast")

  const totalUnread = unreadChatCount + unreadNotifications.length

  const prefixParts = [context.identity, totalUnread > 0 && `(${totalUnread})`]
  const prefix = joinContentfulStrings(prefixParts, " ")
  const title = joinContentfulStrings([prefix, "next"], " | ")

  useEffect(() => {
    document.title = title
  })
}

function joinContentfulStrings(
  strings: Array<string | Falsy>,
  separator: string,
) {
  return strings.filter((s) => s).join(separator)
}
