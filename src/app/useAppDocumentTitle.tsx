import { useObserver } from "mobx-react-lite"
import { useEffect } from "react"
import { useRootStore } from "../RootStore"

export default function useAppDocumentTitle() {
  const {
    viewStore,
    chatStore,
    chatNavigationStore,
    privateChatStore,
  } = useRootStore()

  const title = useObserver(() => {
    const titleContent = (() => {
      switch (viewStore.screen.name) {
        case "login":
          return "Login - next"
        case "characterSelect":
          return "Select Character - next"
        case "chat":
          return `${chatStore.identity} - next`
        default:
          return "next"
      }
    })()

    const unreadCount = chatNavigationStore.tabs.reduce((count, tab) => {
      if (tab.type !== "privateChat") return count

      const chat = privateChatStore.privateChats.get(tab.partnerName)
      return chat.unread ? count + 1 : count
    }, 0)

    return unreadCount > 0 ? `(${unreadCount}) ${titleContent}` : titleContent
  })

  useEffect(() => {
    document.title = title
  }, [title])
}
