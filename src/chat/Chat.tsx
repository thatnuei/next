import clsx from "clsx"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import ChannelView from "../channel/ChannelView"
import {
  CharacterStoreProvider,
  createCharacterStore,
} from "../character/CharacterStore"
import { createFListApi, FListApiProvider } from "../flist/api"
import type { AuthUser } from "../flist/types"
import ChatLogBrowser from "../logging/ChatLogBrowser"
import NotificationListScreen from "../notifications/NotificationListScreen"
import PrivateChatView from "../privateChat/PrivateChatView"
import type { Route } from "../router"
import { createSocketStore, SocketStoreProvider } from "../socket/SocketStore"
import ChatNav from "./ChatNav"
import ConnectionGuard from "./ConnectionGuard"
import NoRoomView from "./NoRoomView"

export default function Chat({
  user: initialUser,
  identity,
  onChangeCharacter,
  onLogout,
}: {
  user: AuthUser
  identity: string
  onChangeCharacter: () => void
  onLogout: () => void
}) {
  const [socket] = useState(createSocketStore)
  const status = socket.status.useValue()

  const [api] = useState(() => createFListApi(initialUser))

  const [characterStore] = useState(() => createCharacterStore(api))
  socket.commands.useListener(characterStore.handleCommand)

  useEffect(() => {
    socket.connect(() => {
      return Promise.resolve({
        account: api.user.account,
        ticket: api.user.ticket,
        character: identity,
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [api.user.account, api.user.ticket, identity, socket])

  return (
    <CharacterStoreProvider value={characterStore}>
      <SocketStoreProvider value={socket}>
        <FListApiProvider value={api}>
          <ConnectionGuard status={status} onLogout={onLogout}>
            <div className="flex flex-row h-full gap-1">
              <div className="hidden md:block">
                <ChatNav identity={identity} onLogout={onChangeCharacter} />
              </div>

              {/* <StalenessState
            className="flex-1 min-w-0 overflow-y-auto"
            isStale={route !== deferredRoute}
          >
            <ChatRoutes route={deferredRoute} />
          </StalenessState> */}
            </div>
          </ConnectionGuard>

          {/* <ChatCommandHandlers />
      <SystemNotificationsHandler />
      <StatusRestorationEffect /> */}

          {/* {import.meta.env.DEV && <DevTools />} */}
        </FListApiProvider>
      </SocketStoreProvider>
    </CharacterStoreProvider>
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
      {route.name === false && <NoRoomView />}
    </>
  )
}
