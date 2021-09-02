import { createContext, useContext, useEffect, useMemo } from "react"
import type { ChannelStore } from "../channel/ChannelStore"
import { createChannelStore } from "../channel/ChannelStore"
import type { ChannelBrowserStore } from "../channelBrowser/ChannelBrowserStore"
import { createChannelBrowserStore } from "../channelBrowser/ChannelBrowserStore"
import type { CharacterStore } from "../character/CharacterStore"
import { createCharacterStore } from "../character/CharacterStore"
import { raise } from "../common/raise"
import type { NonEmptyArray } from "../common/types"
import type { FListApi, LoginResponse } from "../flist/api"
import { useChatLogger } from "../logging/context"
import { createSystemNotificationsHandler } from "../notifications/createSystemNotificationsHandler"
import type { NotificationStore } from "../notifications/NotificationStore"
import { createNotificationStore } from "../notifications/NotificationStore"
import type { PrivateChatStore } from "../privateChat/PrivateChatStore"
import { createPrivateChatStore } from "../privateChat/PrivateChatStore"
import { useRoute } from "../router"
import type { ChatSocket } from "../socket/ChatSocket"
import { createChatSocket } from "../socket/ChatSocket"
import { useEmitterListener } from "../state/emitter"
import createStatusPersistenceHandler from "./createStatusPersistenceHandler"

type ChatContextType = {
  identity: string
  userCharacters: NonEmptyArray<string>
  showLogin: () => void
  showCharacterSelect: () => void

  socket: ChatSocket
  api: FListApi
  characterStore: CharacterStore
  privateChatStore: PrivateChatStore
  channelBrowserStore: ChannelBrowserStore
  notificationStore: NotificationStore
  channelStore: ChannelStore
}

const Context = createContext<ChatContextType>()

export function ChatProvider({
  user,
  identity,
  api,
  onShowLogin,
  onShowCharacterSelect,
  children,
}: {
  user: LoginResponse
  identity: string
  api: FListApi
  onShowLogin: () => void
  onShowCharacterSelect: () => void
  children: React.ReactNode
}) {
  const socket = useMemo(createChatSocket, [])
  const logger = useChatLogger()
  const route = useRoute()

  const characterStore = useMemo(
    () => createCharacterStore(api, identity),
    [api, identity],
  )
  useEmitterListener(socket.commands, characterStore.handleCommand)

  const privateChatStore = useMemo(
    () => createPrivateChatStore(identity, logger, socket),
    [identity, logger, socket],
  )
  useEmitterListener(socket.commands, privateChatStore.handleCommand)

  const channelBrowserStore = useMemo(
    () => createChannelBrowserStore(socket),
    [socket],
  )
  useEmitterListener(socket.commands, channelBrowserStore.handleCommand)

  const notificationStore = useMemo(
    () => createNotificationStore(logger, characterStore, privateChatStore),
    [characterStore, logger, privateChatStore],
  )
  useEmitterListener(socket.commands, notificationStore.handleCommand)

  const channelStore = useMemo(
    () => createChannelStore(identity, socket, logger, characterStore),
    [characterStore, identity, logger, socket],
  )
  useEmitterListener(socket.commands, channelStore.handleCommand)

  useEmitterListener(socket.commands, createSystemNotificationsHandler(route))

  useEmitterListener(
    socket.commands,
    createStatusPersistenceHandler(identity, socket),
  )

  useEffect(() => {
    socket.connect(async () => {
      // the ticket may be invalid since the last time we joined chat
      // I can't figure out a better way to do this right now
      const { account, ticket } = await api.reauthenticate()
      return { account, ticket, character: identity }
    })

    return () => {
      socket.disconnect()
    }
  }, [api, identity, socket])

  const contextValue: ChatContextType = {
    identity,
    userCharacters: user.characters,
    showLogin: onShowLogin,
    showCharacterSelect: onShowCharacterSelect,

    socket,
    api,
    characterStore,
    privateChatStore,
    channelBrowserStore,
    notificationStore,
    channelStore,
  }

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

export function useChatContext(): ChatContextType {
  return useContext(Context) ?? raise(`ChatProvider not found`)
}
