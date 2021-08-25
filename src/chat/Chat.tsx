import clsx from "clsx"
import type { ReactNode } from "react"
import { useDeferredValue, useEffect } from "react"
import ChannelView from "../channel/ChannelView"
import DevTools from "../dev/DevTools"
import ChatLogBrowser from "../logging/ChatLogBrowser"
import NotificationListScreen from "../notifications/NotificationListScreen"
import SystemNotificationsHandler from "../notifications/SystemNotificationsHandler"
import PrivateChatView from "../privateChat/PrivateChatView"
import type { Route } from "../router"
import { useRoute } from "../router"
import { useSocketActions } from "../socket/SocketConnection"
import { useIdentity } from "../user"
import ChatCommandHandlers from "./ChatCommandHandlers"
import ChatNav from "./ChatNav"
import ConnectionGuard from "./ConnectionGuard"
import NoRoomView from "./NoRoomView"
import StatusRestorationEffect from "./StatusRestorationEffect"

export default function Chat() {
  const { connect, disconnect } = useSocketActions()
  const identity = useIdentity()

  useEffect(() => {
    if (identity) {
      connect(identity)
      return () => {
        disconnect()
      }
    }
  }, [connect, disconnect, identity])

  const route = useRoute()
  const deferredRoute = useDeferredValue(route)

  return (
    <>
      <ConnectionGuard>
        <div className="flex flex-row h-full gap-1">
          <div className="hidden md:block">
            <ChatNav />
          </div>
          <StalenessState
            className="flex-1 min-w-0 overflow-y-auto"
            isStale={route !== deferredRoute}
          >
            <ChatRoutes route={deferredRoute} />
          </StalenessState>
        </div>
      </ConnectionGuard>
      <ChatCommandHandlers />
      <SystemNotificationsHandler />
      <StatusRestorationEffect />
      {import.meta.env.DEV && <DevTools />}
    </>
  )
}

function StalenessState({
  className,
  isStale,
  children,
}: {
  isStale: boolean
  className: string
  children: ReactNode
}) {
  return (
    <div
      className={clsx(className, isStale && "transition-opacity opacity-50")}
      style={{ transitionDelay: isStale ? "0.3s" : "0" }}
    >
      {children}
    </div>
  )
}

function ChatRoutes({ route }: { route: Route }) {
  return (
    <>
      {route.name === "channel" && (
        <ChannelView key={route.params.channelId} {...route.params} />
      )}
      {route.name === "privateChat" && (
        <PrivateChatView key={route.params.partnerName} {...route.params} />
      )}
      {route.name === "notifications" && <NotificationListScreen />}
      {route.name === "logs" && <ChatLogBrowser />}
      {route.name === "chat" && <NoRoomView />}
    </>
  )
}
