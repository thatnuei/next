import { useRecoilCallback } from "recoil"
import { useOpenChannelBrowserAction } from "../channelBrowser/state"
import { useChatState } from "../chat/chatStateContext"
import {
  CommandHandlerMap,
  createCommandHandler,
  ServerCommand,
} from "../chat/commandHelpers"
import { useChatCredentials } from "../chat/credentialsContext"
import { useChatSocket, useChatSocketListener } from "../chat/socketContext"
import { useChatStream } from "../chat/streamContext"
import { ChatEvent } from "../chat/types"
import { unique } from "../common/unique"
import {
  createAdMessage,
  createChannelMessage,
  createSystemMessage,
} from "../message/MessageState"
import { useStreamListener } from "../state/stream"
import { channelAtom, channelMessagesAtom, ChannelState } from "./state"
import { loadChannels, saveChannels } from "./storage"

export function useChannelListeners() {
  const state = useChatState()

  const chatStream = useChatStream()
  const socket = useChatSocket()
  const { account, identity } = useChatCredentials()
  const openChannelBrowser = useOpenChannelBrowserAction()

  const streamListener = useRecoilCallback(
    async ({ set, getPromise }, event: ChatEvent) => {
      if (event.type === "join-channel") {
        const channel = await getPromise(channelAtom(event.id))

        if (channel.joinState === "absent") {
          set(
            channelAtom(event.id),
            (prev): ChannelState => ({
              ...prev,
              joinState: "joining",
              title: event.title ?? prev.title,
            }),
          )
          socket.send({ type: "JCH", params: { channel: event.id } })
        }
      }

      if (event.type === "leave-channel") {
        const channel = await getPromise(channelAtom(event.id))

        if (channel.joinState === "present") {
          set(
            channelAtom(event.id),
            (prev): ChannelState => ({
              ...prev,
              joinState: "leaving",
            }),
          )

          socket.send({ type: "LCH", params: { channel: event.id } })
          saveChannels(state, account, identity)
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
  )

  const commandListener = useRecoilCallback(
    ({ set, getPromise }, command: ServerCommand) => {
      const handlerMap: CommandHandlerMap = {
        async IDN() {
          const channels = await loadChannels(account, identity)
          if (channels.length === 0) {
            openChannelBrowser()
          } else {
            for (const { id, title } of channels) {
              chatStream.send({ type: "join-channel", id, title })
            }
          }
        },

        JCH({ channel: id, character: { identity: name }, title }) {
          set(
            channelAtom(id),
            (prev): ChannelState => ({
              ...prev,
              title,
              users: unique([...prev.users, name]),
              joinState: name === identity ? "present" : prev.joinState,
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
            joinState: character === identity ? "absent" : prev.joinState,
          }))
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
  )

  useStreamListener(chatStream, streamListener)
  useChatSocketListener(commandListener)
}
