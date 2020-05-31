import { useRecoilCallback } from "recoil"
import { useOpenChannelBrowserAction } from "../channelBrowser/state"
import { useChatCredentials } from "../chat/credentialsContext"
import { unique } from "../helpers/common/unique"
import {
  createAdMessage,
  createChannelMessage,
  createSystemMessage,
} from "../message/MessageState"
import { runCommand, ServerCommand } from "../socket/commandHelpers"
import { useSocketListener } from "../socket/socketContext"
import {
  channelAtom,
  channelMessagesAtom,
  ChannelState,
  joinedChannelIdsAtom,
  useJoinChannelAction,
  useJoinedChannelIds,
} from "./state"
import { loadChannels, saveChannels } from "./storage"

export function useChannelListeners() {
  const { account, identity } = useChatCredentials()
  const openChannelBrowser = useOpenChannelBrowserAction()
  const joinedIds = useJoinedChannelIds()
  const joinChannel = useJoinChannelAction()

  const commandListener = useRecoilCallback(
    ({ set }, command: ServerCommand) =>
      runCommand(command, {
        async IDN() {
          const channelIds = await loadChannels(account, identity)
          if (channelIds.length === 0) {
            openChannelBrowser()
          } else {
            for (const id of channelIds) joinChannel(id)
          }
        },

        JCH({ channel: id, character: { identity: name }, title }) {
          set(
            channelAtom(id),
            (prev): ChannelState => ({
              ...prev,
              title,
              users: unique([...prev.users, name]),
            }),
          )

          if (name === identity) {
            const newJoinedIds = unique([...joinedIds, id])
            set(joinedChannelIdsAtom, newJoinedIds)
            saveChannels(newJoinedIds, account, identity)
          }
        },

        LCH({ channel: id, character }) {
          set(channelAtom(id), (prev) => ({
            ...prev,
            users: prev.users.filter((name) => name !== character),
          }))

          if (character === identity) {
            const newJoinedIds = unique(
              joinedIds.filter((current) => current !== id),
            )
            set(joinedChannelIdsAtom, newJoinedIds)
            saveChannels(newJoinedIds, account, identity)
          }
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
      }),
    [account, identity, joinChannel, joinedIds, openChannelBrowser],
  )

  useSocketListener(commandListener)
}
