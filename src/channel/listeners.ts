import { useRecoilCallback } from "recoil"
import { useOpenChannelBrowserAction } from "../channelBrowser/state"
import { useChatCredentials } from "../chat/credentialsContext"
import { useChatStream } from "../chat/streamContext"
import { ChatEvent } from "../chat/types"
import { unique } from "../helpers/common/unique"
import {
  createAdMessage,
  createChannelMessage,
  createSystemMessage,
} from "../message/MessageState"
import {
  CommandHandlerMap,
  createCommandHandler,
  ServerCommand,
} from "../socket/commandHelpers"
import { useSocket, useSocketListener } from "../socket/socketContext"
import { useStreamListener } from "../state/stream"
import {
  channelAtom,
  channelMessagesAtom,
  ChannelState,
  joinedChannelIdsAtom,
} from "./state"
import { loadChannels, saveChannels } from "./storage"

export function useChannelListeners() {
  const chatStream = useChatStream()
  const socket = useSocket()
  const { account, identity } = useChatCredentials()
  const openChannelBrowser = useOpenChannelBrowserAction()

  const streamListener = useRecoilCallback(
    async ({ set, getPromise }, event: ChatEvent) => {
      const joinedIds = await getPromise(joinedChannelIdsAtom)
      const isPresent = (id: string) => joinedIds.includes(id)

      if (event.type === "join-channel") {
        if (!isPresent(event.id)) {
          set(
            channelAtom(event.id),
            (prev): ChannelState => ({
              ...prev,
              title: event.title ?? prev.title,
            }),
          )
          socket.send({ type: "JCH", params: { channel: event.id } })
        }
      }

      if (event.type === "leave-channel") {
        if (isPresent(event.id)) {
          socket.send({ type: "LCH", params: { channel: event.id } })
          saveChannels(joinedIds, account, identity)
        }
      }

      if (event.type === "send-channel-message") {
        set(channelMessagesAtom(event.channelId), (prev) => [
          ...prev,
          createChannelMessage(identity, event.text),
        ])
        socket.send({
          type: "MSG",
          params: { channel: event.channelId, message: event.text },
        })
      }
    },
    [account, identity, socket],
  )

  const commandListener = useRecoilCallback(
    ({ set, getPromise }, command: ServerCommand) => {
      const handlerMap: CommandHandlerMap = {
        async IDN() {
          const channelIds = await loadChannels(account, identity)
          if (channelIds.length === 0) {
            openChannelBrowser()
          } else {
            for (const id of channelIds) {
              chatStream.send({ type: "join-channel", id })
            }
          }
        },

        JCH({ channel: id, character: { identity: name }, title }) {
          set(joinedChannelIdsAtom, (prev) => [...prev, id])

          set(
            channelAtom(id),
            (prev): ChannelState => ({
              ...prev,
              title,
              users: unique([...prev.users, name]),
            }),
          )

          if (name === identity) {
            // we can't get all of the channel states,
            // so we'll probably have to store an array of joined channel IDs somewhere else
            // saveChannels(state, account, identity)
          }
        },

        LCH({ channel: id, character }) {
          set(channelAtom(id), (prev) => ({
            ...prev,
            users: prev.users.filter((name) => name !== character),
          }))

          set(joinedChannelIdsAtom, (prev) =>
            prev.filter((current) => current !== id),
          )
        },

        ICH({ channel: id, users, mode }) {
          set(channelAtom(id), (prev) => ({
            ...prev,
            users: unique(users.map((it) => it.identity)),
            mode,
          }))
        },

        CDS({ channel: id, description }) {
          set(channelAtom(id), (prev) => ({ ...prev, description }))
        },

        COL({ channel: id, oplist }) {
          set(channelAtom(id), (prev) => ({ ...prev, ops: oplist }))
        },

        MSG({ channel: id, character, message }) {
          set(channelMessagesAtom(id), (prev) => [
            ...prev,
            createChannelMessage(character, message),
          ])

          // update unread state
        },

        LRP({ channel: id, character, message }) {
          set(channelMessagesAtom(id), (prev) => [
            ...prev,
            createAdMessage(character, message),
          ])
        },

        RLL(params) {
          if ("channel" in params) {
            const { channel: id, message } = params
            set(channelMessagesAtom(id), (prev) => [
              ...prev,
              createSystemMessage(message),
            ])
          }
        },
      }

      return createCommandHandler(handlerMap)(command)
    },
    [account, chatStream, identity, openChannelBrowser],
  )

  useStreamListener(chatStream, streamListener)
  useSocketListener(commandListener)
}
