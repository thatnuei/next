import clsx from "clsx"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import ChannelView from "../channel/ChannelView"
import {
  CharacterStore,
  CharacterStoreProvider,
} from "../character/CharacterStore"
import type { AuthUser } from "../flist/types"
import ChatLogBrowser from "../logging/ChatLogBrowser"
import NotificationListScreen from "../notifications/NotificationListScreen"
import PrivateChatView from "../privateChat/PrivateChatView"
import type { Route } from "../router"
import { SocketStore } from "../socket/SocketStore"
import { useEmitterListener } from "../state/emitter"
import { useStoreKey } from "../state/store"
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
  const [socket] = useState(() => new SocketStore())
  const [characterStore] = useState(() => new CharacterStore())

  const status = useStoreKey(socket, "status")

  useEmitterListener(socket.commands, (command) =>
    characterStore.handleCommand(command),
  )

  useEffect(() => {
    socket.connect(() => {
      return Promise.resolve({
        account: initialUser.account,
        ticket: initialUser.ticket,
        character: identity,
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [identity, initialUser.account, initialUser.ticket, socket])

  return (
    <CharacterStoreProvider value={characterStore}>
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
