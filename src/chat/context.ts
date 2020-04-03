import { useEffect, useMemo } from "react"
import { createChannelCommandHandler } from "../channel/commands"
import { createChannelBrowserCommandHandler } from "../channelBrowser/state"
import { createCharacterCommandHandler } from "../character/helpers"
import createContextWrapper from "../react/createContextWrapper"
import { createStatusCommandHandler } from "../statusUpdate/actions"
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
        createChannelCommandHandler(state, identity),
        createChannelBrowserCommandHandler(state),
        createStatusCommandHandler(state, identity),
      ]),
    [identity, state],
  )

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

      const wasHandled = handleCommand(command)
      if (!wasHandled && process.env.NODE_ENV === "development") {
        console.log(command.type, command.params)
      }
    }

    socket.connect({ account, ticket, identity })
    return () => socket.disconnect()
  }, [socket, account, ticket, identity, handleCommand])

  return { state, socket, identity }
}

export const useChatContext = createContextWrapper(useChat)
export const ChatProvider = useChatContext.Provider
