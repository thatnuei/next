import { memo, useDeferredValue } from "react"
import ChannelView from "../channel/ChannelView"
import { useJoinedChannels } from "../channel/useJoinedChannels"
import DevTools from "../dev/DevTools"
import ChatLogBrowser from "../logging/ChatLogBrowser"
import NotificationListScreen from "../notifications/NotificationListScreen"
import NotificationToastOverlay from "../notifications/NotificationToastOverlay"
import PrivateChatView from "../privateChat/PrivateChatView"
import { useRoute } from "../router"
import { useStoreValue } from "../state/store"
import StalenessState from "../ui/StalenessState"
import { useChatContext } from "./ChatContext"
import ChatNav from "./ChatNav"
import NoRoomView from "./NoRoomView"
import SocketStatusGuard from "./SocketStatusGuard"
import { useChatDocumentTitle } from "./useChatDocumentTitle"

export default function Chat() {
  useChatDocumentTitle()

  return (
    <SocketStatusGuard>
      <div className="flex h-full gap-1">
        <div className="hidden md:block">
          <ChatNav />
        </div>
        <div className="flex-1 min-w-0 overflow-y-auto">
          <ChatRoutes />
        </div>
      </div>
      {import.meta.env.DEV && <DevTools />}
      <NotificationToastOverlay />
    </SocketStatusGuard>
  )
}

const ChatRoutes = memo(function ChatRoutes() {
  const context = useChatContext()
  const route = useRoute()
  const joinedChannels = useJoinedChannels()

  const channelRoute =
    route.name === "channel" &&
    joinedChannels.some((ch) => ch.id === route.params.channelId) &&
    route

  const deferredChannelRoute = useDeferredValue(channelRoute)

  const privateChatRoute = useStoreValue(
    context.privateChatStore.openChatNames.select(
      (openChatNames) =>
        route.name === "privateChat" &&
        openChatNames[route.params.partnerName] &&
        route,
    ),
    // the route object has functions on it,
    // so deepEquals won't work here
    Object.is,
  )
  const deferredPrivateChatRoute = useDeferredValue(privateChatRoute)

  if (deferredChannelRoute) {
    return (
      <StalenessState isStale={deferredChannelRoute !== channelRoute}>
        <ChannelView
          key={deferredChannelRoute.params.channelId}
          {...deferredChannelRoute.params}
        />
      </StalenessState>
    )
  }

  if (deferredPrivateChatRoute) {
    return (
      <StalenessState isStale={deferredPrivateChatRoute !== privateChatRoute}>
        <PrivateChatView
          key={deferredPrivateChatRoute.params.partnerName}
          {...deferredPrivateChatRoute.params}
        />
      </StalenessState>
    )
  }

  if (route.name === "notifications") {
    return <NotificationListScreen />
  }

  if (route.name === "logs") {
    return <ChatLogBrowser />
  }

  return <NoRoomView />
})
