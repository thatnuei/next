import { useEffect, useMemo } from "react"
import { createChannelCommandHandler } from "../channel/state"
import { createChannelBrowserCommandHandler } from "../channelBrowser/state"
import { createCharacterCommandHandler } from "../character/state"
import { createChatNavCommandHandler } from "../chatNav/state"
import { createPrivateChatCommandHandler } from "../privateChat/state"
import createContextWrapper from "../react/createContextWrapper"
import { createStatusCommandHandler } from "../statusUpdate/state"
import { ChatState } from "./ChatState"
import { combineCommandHandlers } from "./commandHelpers"
import { SocketHandler } from "./SocketHandler"
import { ChatCredentials } from "./types"

function useChat({ account, ticket, identity }: ChatCredentials) {
  const state = useMemo(() => new ChatState(), [])
  const socket = useMemo(() => new SocketHandler(), [])

  const handleCommand = useMemo(
    () =>
      combineCommandHandlers([
        createCharacterCommandHandler(state),
        createChannelCommandHandler(state),
        createPrivateChatCommandHandler(state),
        createChannelBrowserCommandHandler(state),
        createStatusCommandHandler(state, identity),
        createChatNavCommandHandler(state, identity, socket),
      ]),
    [identity, socket, state],
  )

  useEffect(() => {
    socket.listener = (command) => {
      const wasHandled = handleCommand(command)
      if (!wasHandled && process.env.NODE_ENV === "development") {
        console.log(command.type, command.params)
      }
    }
  }, [socket, handleCommand])

  useEffect(() => {
    socket.connect({ account, ticket, identity })
    return () => socket.disconnect()
  }, [account, identity, socket, ticket])

  return { state, socket, identity }
}

export const useChatContext = createContextWrapper(useChat)
export const ChatProvider = useChatContext.Provider
