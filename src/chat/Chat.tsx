import clsx from "clsx"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import ChannelView from "../channel/ChannelView"
import type { AuthUser } from "../flist/types"
import ChatLogBrowser from "../logging/ChatLogBrowser"
import NotificationListScreen from "../notifications/NotificationListScreen"
import PrivateChatView from "../privateChat/PrivateChatView"
import type { Route } from "../router"
import { SocketStore, SocketStoreProvider } from "../socket/SocketStore"
import { useStoreKey } from "../state/store"
import ConnectionGuard from "./ConnectionGuard"
import NoRoomView from "./NoRoomView"

export default function Chat({
  user,
  identity,
}: {
  user: AuthUser
  identity: string
}) {
  const [socket] = useState(() => new SocketStore())
  const status = useStoreKey(socket, "status")

  useEffect(() => {
    if (identity) {
      socket.connect(() =>
        Promise.resolve({
          account: user.account,
          ticket: user.ticket,
          character: identity,
        }),
      )

      return () => {
        socket.disconnect()
      }
    }
  }, [identity, socket, user.account, user.ticket])

  // const route = useRoute()
  // const deferredRoute = useDeferredValue(route)

  return (
    <SocketStoreProvider value={socket}>
      <ConnectionGuard status={status}>
        {/* <div className="flex flex-row h-full gap-1">
          <div className="hidden md:block">
            <ChatNav />
          </div>
          <StalenessState
            className="flex-1 min-w-0 overflow-y-auto"
            isStale={route !== deferredRoute}
          >
            <ChatRoutes route={deferredRoute} />
          </StalenessState>
        </div> */}
        <p>chat</p>
      </ConnectionGuard>
      {/* <ChatCommandHandlers />
      <SystemNotificationsHandler />
      <StatusRestorationEffect /> */}
      {/* {import.meta.env.DEV && <DevTools />} */}
    </SocketStoreProvider>
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
