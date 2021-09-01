import { createContext, useContext, useEffect, useState } from "react"
import type { ChannelBrowserStore } from "../channelBrowser/ChannelBrowserStore"
import { createChannelBrowserStore } from "../channelBrowser/ChannelBrowserStore"
import type { CharacterStore } from "../character/CharacterStore"
import { createCharacterStore } from "../character/CharacterStore"
import { raise } from "../common/raise"
import type { FListApi } from "../flist/api"
import { createFListApi } from "../flist/api"
import type { AuthUser } from "../flist/types"
import { useChatLogger } from "../logging/context"
import type { PrivateChatStore } from "../privateChat/PrivateChatStore"
import { createPrivateChatStore } from "../privateChat/PrivateChatStore"
import type { SocketStore } from "../socket/SocketStore"
import { createSocketStore } from "../socket/SocketStore"
import { useEmitterListener } from "../state/emitter"

type ChatContextType = {
  user: AuthUser
  identity: string
  showLogin: () => void
  showCharacterSelect: () => void

  socket: SocketStore
  api: FListApi
  characterStore: CharacterStore
  privateChatStore: PrivateChatStore
  channelBrowserStore: ChannelBrowserStore
}

const Context = createContext<ChatContextType>()

export function ChatProvider({
  user,
  identity,
  onShowLogin,
  onShowCharacterSelect,
  children,
}: {
  user: AuthUser
  identity: string
  onShowLogin: () => void
  onShowCharacterSelect: () => void
  children: React.ReactNode
}) {
  const [socket] = useState(createSocketStore)
  const [api] = useState(() => createFListApi(user))
  const logger = useChatLogger()

  const [characterStore] = useState(() => createCharacterStore(api, identity))
  useEmitterListener(socket.commands, characterStore.handleCommand)

  const [privateChatStore] = useState(() =>
    createPrivateChatStore(identity, logger, socket),
  )
  useEmitterListener(socket.commands, privateChatStore.handleCommand)

  const [channelBrowserStore] = useState(() =>
    createChannelBrowserStore(socket),
  )
  useEmitterListener(socket.commands, channelBrowserStore.handleCommand)

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

  const contextValue: ChatContextType = {
    user,
    identity,
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
