import { createContext, useContext, useEffect, useState } from "react"
import type { ChannelBrowserStore } from "../channelBrowser/ChannelBrowserStore"
import { createChannelBrowserStore } from "../channelBrowser/ChannelBrowserStore"
import type { CharacterStore } from "../character/CharacterStore"
import { createCharacterStore } from "../character/CharacterStore"
import { raise } from "../common/raise"
import type { NonEmptyArray } from "../common/types"
import type { FListApi, LoginResponse } from "../flist/api"
import { useChatLogger } from "../logging/context"
import { createSystemNotificationsHandler } from "../notifications/createSystemNotificationsHandler"
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
  const [socket] = useState(createChatSocket)
  const logger = useChatLogger()
  const route = useRoute()

  const [characterStore] = useState(() => createCharacterStore(api, identity))

  const [privateChatStore] = useState(() => {
    return createPrivateChatStore(identity, logger, socket)
  })

  const [channelBrowserStore] = useState(() => {
    return createChannelBrowserStore(socket)
  })

  useEmitterListener(socket.commands, characterStore.handleCommand)
  useEmitterListener(socket.commands, privateChatStore.handleCommand)
  useEmitterListener(socket.commands, channelBrowserStore.handleCommand)
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
  }

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

export function useChatContext(): ChatContextType {
  return useContext(Context) ?? raise(`ChatProvider not found`)
}
