import { useDeferredValue } from "react"
import { useChannelCommandHandler } from "../channel/state"
import { useNotificationCommandListener } from "../notifications/state"
import PrivateChatView from "../privateChat/PrivateChatView"
import { useRoute } from "../router"
import { useEmitterListener } from "../state/emitter"
import { useStoreValue } from "../state/store"
import StalenessState from "../ui/StalenessState"
import { useChatContext } from "./ChatContext"
import ChatNav from "./ChatNav"
import NoRoomView from "./NoRoomView"
import SocketStatusGuard from "./SocketStatusGuard"

export default function Chat() {
  const context = useChatContext()
  useEmitterListener(context.socket.commands, useChannelCommandHandler())
  useEmitterListener(context.socket.commands, useNotificationCommandListener())

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
    </SocketStatusGuard>
  )
}

function ChatRoutes() {
  const context = useChatContext()
  const route = useRoute()

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

  return <NoRoomView />

  // return (
  //   <>
  //     {route.name === "channel" && (
  //       <ChannelView key={route.params.channelId} {...route.params} />
  //     )}
  //     {route.name === "privateChat" && (
  //       <PrivateChatView key={route.params.partnerName} {...route.params} />
  //     )}
  //     {route.name === "notifications" && <NotificationListScreen />}
  //     {route.name === "logs" && <ChatLogBrowser />}
  //     {route.name === false && <NoRoomView />}
  //   </>
  // )
}
