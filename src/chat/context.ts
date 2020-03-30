import { useEffect, useMemo } from "react"
import { ChannelBrowserStore } from "../channel/ChannelBrowserStore"
import { ChannelStore } from "../channel/ChannelStore"
import { CharacterStore } from "../character/CharacterStore"
import createContextWrapper from "../react/createContextWrapper"
import { ChatNavStore } from "./ChatNavStore"
import { ChatStore } from "./ChatStore"
import { SocketHandler } from "./SocketHandler"

export const useChatContext = createContextWrapper(function useChat({
  account,
  ticket,
  identity,
}: {
  account: string
  ticket: string
  identity: string
}) {
  const socket = useMemo(() => new SocketHandler(), [])

  const characterStore = useMemo(() => new CharacterStore(), [])

  const chatStore = useMemo(() => new ChatStore(socket, characterStore), [
    socket,
    characterStore,
  ])

  const channelStore = useMemo(
    () => new ChannelStore(identity, socket, characterStore),
    [identity, socket, characterStore],
  )

  const channelBrowserStore = useMemo(() => new ChannelBrowserStore(socket), [
    socket,
  ])

  const navStore = useMemo(() => new ChatNavStore(channelStore), [channelStore])

  useEffect(() => {
    socket.listener = (command) => {
      const wasHandled = [
        chatStore.handleCommand(command),
        characterStore.handleCommand(command),
        channelStore.handleCommand(command),
        channelBrowserStore.handleCommand(command),
      ].some((result) => result === true)

      if (!wasHandled && process.env.NODE_ENV === "development") {
        console.log(command.type, command.params)
      }
    }

    socket.connect({ account, ticket, identity })
    return () => socket.disconnect()
  }, [
    socket,
    account,
    ticket,
    identity,
    chatStore,
    characterStore,
    channelStore,
    channelBrowserStore,
  ])

  return {
    identity,
    chatStore,
    characterStore,
    channelStore,
    channelBrowserStore,
    navStore,
  }
})

export const ChatProvider = useChatContext.Provider
