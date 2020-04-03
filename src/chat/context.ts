import { useEffect, useMemo } from "react"
import { ChannelBrowserStore } from "../channel/ChannelBrowserStore"
import { ChannelStore } from "../channel/ChannelStore"
import { CharacterStore } from "../character/CharacterStore"
import { createCharacterCommandHandler } from "../character/helpers"
import createContextWrapper from "../react/createContextWrapper"
import { useInstanceValue } from "../react/useInstanceValue"
import { ChatNavStore } from "./ChatNavStore"
import { ChatState } from "./ChatState"
import { combineCommandHandlers } from "./commands"
import { SocketHandler } from "./SocketHandler"
import { ChatCredentials } from "./types"

function useChat({ account, ticket, identity }: ChatCredentials) {
  const state = useInstanceValue(() => new ChatState())

  const socket = useMemo(() => new SocketHandler(), [])

  const handleCommand = useMemo(
    () => combineCommandHandlers([createCharacterCommandHandler(state)]),
    [state],
  )

  const characterStore = useMemo(() => new CharacterStore(), [])

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
      if (command.type === "IDN") {
        socket.send({ type: "JCH", params: { channel: "Frontpage" } })
        socket.send({ type: "JCH", params: { channel: "Fantasy" } })
        socket.send({
          type: "JCH",
          params: { channel: "Story Driven LFRP" },
        })
        socket.send({ type: "JCH", params: { channel: "Development" } })
        socket.send({ type: "JCH", params: { channel: "Femboy" } })
      }

      const wasHandled = [
        handleCommand(command),
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
    characterStore,
    channelStore,
    channelBrowserStore,
    handleCommand,
  ])

  return {
    state,
    identity,
    characterStore,
    channelStore,
    channelBrowserStore,
    navStore,
  }
}

export const useChatContext = createContextWrapper(useChat)
export const ChatProvider = useChatContext.Provider
