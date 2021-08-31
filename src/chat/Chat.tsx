import clsx from "clsx"
import type { ReactNode } from "react"
import { useDeferredValue, useEffect, useState } from "react"
import { createChannelBrowserStore } from "../channelBrowser/ChannelBrowserStore"
import {
  CharacterStoreProvider,
  createCharacterStore,
} from "../character/CharacterStore"
import { createFListApi, FListApiProvider } from "../flist/api"
import type { AuthUser } from "../flist/types"
import { useChatLogger } from "../logging/context"
import {
  createPrivateChatStore,
  PrivateChatProvider,
} from "../privateChat/PrivateChatStore"
import PrivateChatView from "../privateChat/PrivateChatView"
import type { WrapperFn } from "../react/WrapperStack"
import WrapperStack from "../react/WrapperStack"
import { useRoute } from "../router"
import { createSocketStore, SocketStoreProvider } from "../socket/SocketStore"
import { useStoreValue } from "../state/store"
import ChatMenuButton from "./ChatMenuButton"
import ChatNav from "./ChatNav"
import ConnectionGuard from "./ConnectionGuard"
import { IdentityContextProvider } from "./identity-context"

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
  const status = useStoreValue(socket.status)

  const [api] = useState(() => createFListApi(initialUser))

  const logger = useChatLogger()

  const [characterStore] = useState(() => createCharacterStore(api, identity))
  socket.commands.useListener(characterStore.handleCommand)

  const [privateChatStore] = useState(() =>
    createPrivateChatStore(identity, logger, socket),
  )
  socket.commands.useListener(privateChatStore.handleCommand)

  const [channelBrowserStore] = useState(() =>
    createChannelBrowserStore(socket),
  )
  socket.commands.useListener(channelBrowserStore.handleCommand)

  const route = useRoute()
  const deferredRoute = useDeferredValue(route)

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

  const wrappers: WrapperFn[] = [
    (p) => <IdentityContextProvider value={identity} {...p} />,
    (p) => <SocketStoreProvider value={socket} {...p} />,
    (p) => <FListApiProvider value={api} {...p} />,
    (p) => <CharacterStoreProvider value={characterStore} {...p} />,
    (p) => <PrivateChatProvider value={privateChatStore} {...p} />,
    (p) => <ConnectionGuard status={status} onLogout={onLogout} {...p} />,
  ]

  const chatNav = (
    <ChatNav
      channelBrowserStore={channelBrowserStore}
      onLogout={onChangeCharacter}
    />
  )

  return (
    <WrapperStack wrappers={wrappers}>
      <div className="flex flex-row h-full gap-1">
        <div className="hidden md:block">{chatNav}</div>

        <StalenessState
          className="flex-1 min-w-0 overflow-y-auto"
          isStale={route !== deferredRoute}
        >
          {deferredRoute.name === "privateChat" && (
            <PrivateChatView
              key={deferredRoute.params.partnerName}
              partnerName={deferredRoute.params.partnerName}
              privateChatStore={privateChatStore}
              socket={socket}
              identity={identity}
              menuButton={<ChatMenuButton>{chatNav}</ChatMenuButton>}
            />
          )}
        </StalenessState>
      </div>
    </WrapperStack>
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

/* 
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
 */
