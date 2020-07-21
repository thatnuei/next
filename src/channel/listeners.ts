import { uniq } from "lodash/fp"
import { useRecoilCallback } from "recoil"
import { useOpenChannelBrowserAction } from "../channelBrowser/state"
import { useChatCredentials } from "../chat/helpers"
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
} from "./state"
import { loadChannels, saveChannels } from "./storage"

export function useChannelListeners() {
  const { account, identity } = useChatCredentials()
  const openChannelBrowser = useOpenChannelBrowserAction()
  const joinChannel = useJoinChannelAction()

  const commandListener = useRecoilCallback(
    ({ set, snapshot }) => (command: ServerCommand) =>
      runCommand(command, {
        async IDN() {
          const channelIds = await loadChannels(account, identity)
          if (channelIds.length === 0) {
            openChannelBrowser()
          } else {
            for (const id of channelIds) joinChannel(id)
          }
        },

        async JCH({ channel: id, character: { identity: name }, title }) {
          if (name === identity) {
            const joinedIds = await snapshot.getPromise(joinedChannelIdsAtom)
            const newJoinedIds = uniq([...joinedIds, id])
            set(joinedChannelIdsAtom, newJoinedIds)
            saveChannels(newJoinedIds, account, identity)
          }

          set(
            channelAtom(id),
            (prev): ChannelState => ({
              ...prev,
              title,
              users: uniq([...prev.users, name]),
            }),
          )
        },

        async LCH({ channel: id, character }) {
          if (character === identity) {
            const joinedIds = await snapshot.getPromise(joinedChannelIdsAtom)
            const newJoinedIds = uniq(
              joinedIds.filter((current) => current !== id),
            )
            set(joinedChannelIdsAtom, newJoinedIds)
            saveChannels(newJoinedIds, account, identity)
          }

          set(channelAtom(id), (prev) => ({
            ...prev,
            users: prev.users.filter((name) => name !== character),
          }))
        },

        ICH({ channel: id, users, mode }) {
          set(channelAtom(id), (prev) => ({
            ...prev,
            users: uniq(users.map((it) => it.identity)),
            mode,
          }))
        },

        CDS({ channel: id, description }) {
          set(channelAtom(id), (prev) => ({ ...prev, description }))
        },

        COL({ channel: id, oplist }) {
          set(channelAtom(id), (prev) => ({ ...prev, ops: oplist as string[] }))
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
    [account, identity, joinChannel, openChannelBrowser],
  )

  useSocketListener(commandListener)
}
