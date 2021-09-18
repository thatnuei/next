import { useEffect } from "react"
import type { Falsy } from "../common/types"
import { useRoute } from "../router"
import { useStoreValue } from "../state/store"
import { useChatContext } from "./ChatContext"

export function useChatDocumentTitle() {
  const context = useChatContext()

  const unreadChatCount = useStoreValue(
    context.privateChatStore
      .selectOpenPrivateChats()
      .select((chats) => chats.filter((chat) => chat.isUnread).length),
  )

  const unreadNotificationCount = useStoreValue(
    context.notificationStore.notifications.select((notifications) => {
      const importantNotifications = notifications
        .filter((n) => n.readStatus === "unread")
        .filter(
          (n) => n.details.type === "invite" || n.details.type === "broadcast",
        )
      return importantNotifications.length
    }),
  )

  const totalUnread = unreadChatCount + unreadNotificationCount

  const prefixParts = [context.identity, totalUnread > 0 && `(${totalUnread})`]
  const prefix = joinContentfulStrings(prefixParts, " ")
  const title = joinContentfulStrings([prefix, "next"], " | ")

  const route = useRoute()

  useEffect(() => {
    document.title = title
    // the browser stores titles with each history entry,
    // so going back could show an old and incorrect notification count,
    // so we need to update the title when the route changes
  }, [title, route])
}

function joinContentfulStrings(
  strings: Array<string | Falsy>,
  separator: string,
) {
  return strings.filter((s) => s).join(separator)
}
