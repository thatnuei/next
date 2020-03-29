import { useEffect, useMemo } from "react"
import { ChannelStore } from "../channel/ChannelStore"
import { CharacterStore } from "../character/CharacterStore"
import createContextWrapper from "../react/createContextWrapper"
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
  const chatStore = useMemo(() => new ChatStore(socket), [socket])
  const characterStore = useMemo(() => new CharacterStore(), [])
  const channelStore = useMemo(() => new ChannelStore(identity), [identity])

  useEffect(() => {
    socket.listener = (command) => {
      const wasHandled = [
        chatStore.handleCommand(command),
        characterStore.handleCommand(command),
        channelStore.handleCommand(command),
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
  ])

  return { identity, chatStore, characterStore, channelStore }
})

export const ChatProvider = useChatContext.Provider
