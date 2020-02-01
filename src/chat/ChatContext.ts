import { useEffect, useMemo } from "react"
import { ChannelBrowserStore } from "../channel/ChannelBrowserStore"
import { ChannelStore } from "../channel/ChannelStore"
import { CharacterStore } from "../character/CharacterStore"
import { PrivateChatStore } from "../private-chat/PrivateChatStore"
import createContextWrapper from "../react/helpers/createContextWrapper"
import { useChannel } from "../state/hooks/useChannel"
import { ChatNavigationStore } from "./ChatNavigationStore"
import { ChatStore } from "./ChatStore"
import { SocketStore } from "./SocketStore"

type ChatContextProps = {
  account: string
  ticket: string
  identity: string
  onClose: () => void
  onConnectionError: () => void
}

const useChatContext = createContextWrapper(
  ({
    account,
    ticket,
    identity,
    onClose,
    onConnectionError,
  }: ChatContextProps) => {
    // socket
    const socketStore = useMemo(() => new SocketStore(), [])
    useEffect(() => {
      return socketStore.connect({ account, ticket, identity })
    }, [socketStore, account, identity, ticket])
    useChannel(socketStore.closeListeners, onClose)
    useChannel(socketStore.errorListeners, onConnectionError)

    // chat
    const chatStore = useMemo(() => new ChatStore(), [])
    useChannel(socketStore.commandListeners, chatStore.handleSocketCommand)

    // character
    const characterStore = useMemo(() => new CharacterStore(), [])
    useChannel(socketStore.commandListeners, characterStore.handleSocketCommand)

    // channel
    const channelStore = useMemo(
      () => new ChannelStore(socketStore, identity),
      [identity, socketStore],
    )
    useChannel(socketStore.commandListeners, channelStore.handleSocketCommand)

    // private chat
    const privateChatStore = useMemo(() => new PrivateChatStore(), [])
    useChannel(
      socketStore.commandListeners,
      privateChatStore.handleSocketCommand,
    )

    // navigation
    const navigationStore = useMemo(
      () => new ChatNavigationStore(identity, channelStore),
      [identity, channelStore],
    )
    useChannel(
      socketStore.commandListeners,
      navigationStore.handleSocketCommand,
    )

    // channel browser
    const channelBrowserStore = useMemo(
      () => new ChannelBrowserStore(socketStore),
      [socketStore],
    )
    useChannel(
      socketStore.commandListeners,
      channelBrowserStore.handleSocketCommand,
    )

    return {
      identity,
      chatStore,
      characterStore,
      channelStore,
      privateChatStore,
      navigationStore,
      channelBrowserStore,
    }
  },
)

export const ChatProvider = useChatContext.Provider

export const useIdentity = () => useChatContext().identity
export const useChatStore = () => useChatContext().chatStore
export const useChatNavigationStore = () => useChatContext().navigationStore

export const useCharacterStore = () => useChatContext().characterStore

export function useCharacter(name: string) {
  const store = useCharacterStore()
  return store.get(name)
}

export const useChannelStore = () => useChatContext().channelStore
export const usePrivateChatStore = () => useChatContext().privateChatStore
export const useChannelBrowserStore = () => useChatContext().channelBrowserStore
