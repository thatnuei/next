import { atom, useAtom } from "jotai"
import { selectAtom, useAtomValue, useUpdateAtom } from "jotai/utils"
import { mapValues } from "lodash-es"
import { useCallback, useEffect, useMemo, useState } from "react"
import { usePresentCharacters } from "../character/state"
import type { Character } from "../character/types"
import { omit } from "../common/omit"
import { truthyMap } from "../common/truthyMap"
import type { Dict, TruthyMap } from "../common/types"
import { dictionaryAtomFamily } from "../jotai/dictionaryAtomFamily"
import { useUpdateAtomFn } from "../jotai/useUpdateAtomFn"
import { useUpdateDictAtom } from "../jotai/useUpdateDictAtom"
import { useChatLogger } from "../logging/context"
import type { MessageState } from "../message/MessageState"
import {
  createAdMessage,
  createChannelMessage,
  createSystemMessage,
} from "../message/MessageState"
import type { RoomState } from "../room/state"
import {
  addRoomMessage,
  clearRoomMessages,
  createRoomState,
  setRoomUnread,
} from "../room/state"
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import { useSocketActions, useSocketListener } from "../socket/SocketConnection"
import { useAccount, useIdentity } from "../user"
import { loadChannels, saveChannels } from "./storage"
import type { ChannelMode } from "./types"

type ChannelJoinState = "joining" | "joined" | "leaving" | "left"

export type Channel = {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly mode: ChannelMode
  readonly selectedMode: ChannelMode
  readonly users: TruthyMap
  readonly ops: TruthyMap
  readonly joinState: ChannelJoinState
  readonly previousMessages: readonly MessageState[]
} & RoomState

function createChannel(id: string): Channel {
  return {
    id,
    title: id,
    description: "",
    mode: "both",
    selectedMode: "chat",
    users: {},
    ops: {},
    joinState: "left",
    previousMessages: [],
    ...createRoomState(),
  }
}

const channelDictAtom = atom<Dict<Channel>>({})

const channelAtom = dictionaryAtomFamily(channelDictAtom, createChannel)

const isChannelJoined = (channel: Channel) => channel.joinState !== "left"

export function useChannel(id: string): Channel {
  return useAtomValue(channelAtom(id))
}

export function useJoinedChannels(): readonly Channel[] {
  const channels = Object.values(useAtomValue(channelDictAtom))
  return useMemo(() => channels.filter(isChannelJoined), [channels])
}

export function useIsChannelJoined(id: string) {
  return useAtomValue(selectAtom(channelAtom(id), isChannelJoined))
}

export function useChannelCharacters(id: string): readonly Character[] {
  const channelUsers = useAtomValue(
    useMemo(() => {
      return selectAtom(channelAtom(id), (channel) => channel.users)
    }, [id]),
  )

  return usePresentCharacters(Object.keys(channelUsers))
}

export function useActualChannelMode(id: string) {
  const channel = useChannel(id)
  return channel.mode === "both" ? channel.selectedMode : channel.mode
}

export function useJoinChannel() {
  const { send } = useSocketActions()
  const updateAtom = useUpdateAtomFn()

  return useCallback(
    (id: string, title?: string) => {
      send({
        type: "JCH",
        params: { channel: id },
      })
      updateAtom(channelAtom(id), (channel) => ({
        ...channel,
        joinState: "joining",
        title: title || channel.title,
      }))
    },
    [send, updateAtom],
  )
}

function useAddChannelMessage() {
  const updateChannels = useUpdateDictAtom(channelDictAtom, createChannel)
  const logger = useChatLogger()
  return useCallback(
    (id: string, message: MessageState) => {
      updateChannels(id, (channel) => addRoomMessage(channel, message))
      logger.addMessage(`channel:${id}`, message)
    },
    [updateChannels, logger],
  )
}

export function useChannelActions(id: string) {
  const { send } = useSocketActions()
  const identity = useIdentity()
  const updateChannel = useUpdateAtom(channelAtom(id))
  const joinChannel = useJoinChannel()
  const addChannelMessage = useAddChannelMessage()

  return useMemo(() => {
    return {
      join: (title?: string) => joinChannel(id, title),

      leave: () => {
        send({ type: "LCH", params: { channel: id } })
        updateChannel((channel) => ({ ...channel, joinState: "leaving" }))
      },

      addMessage: (message: MessageState) => {
        addChannelMessage(id, message)
      },

      clearMessages: () => {
        updateChannel(clearRoomMessages)
      },

      sendMessage: (message: string) => {
        if (!identity) return

        const rollPrefix = "/roll"
        if (message.startsWith(rollPrefix)) {
          send({
            type: "RLL",
            params: {
              channel: id,
              dice: message.slice(rollPrefix.length).trim() || "1d20",
            },
          })
          return
        }

        const bottlePrefix = "/bottle"
        if (message.startsWith(bottlePrefix)) {
          send({
            type: "RLL",
            params: {
              channel: id,
              dice: "bottle",
            },
          })
          return
        }

        send({ type: "MSG", params: { channel: id, message } })
        addChannelMessage(id, createChannelMessage(identity, message))
      },

      setSelectedMode: (selectedMode: ChannelMode) => {
        updateChannel((channel) => ({ ...channel, selectedMode }))
      },

      setInput: (input: string) => {
        updateChannel((channel) => ({ ...channel, input }))
      },

      markRead: () => {
        updateChannel((channel) => setRoomUnread(channel, false))
      },
    }
  }, [addChannelMessage, id, identity, joinChannel, send, updateChannel])
}

export function useChannelCommandListener() {
  const identity = useIdentity()
  const account = useAccount()
  const logger = useChatLogger()
  const [channelDict, setChannelDict] = useAtom(channelDictAtom)
  const updateAtom = useUpdateAtomFn()
  const joinChannel = useJoinChannel()
  const [channelsLoaded, setChannelsLoaded] = useState(false)
  const addChannelMessage = useAddChannelMessage()

  useEffect(() => {
    if (!channelsLoaded) return
    if (!account || !identity) return

    const channels = Object.values(channelDict)
      .filter(isChannelJoined)
      .map((ch) => ch.id)

    saveChannels(channels, account, identity)
  }, [account, channelDict, channelsLoaded, identity])

  useSocketListener((command: ServerCommand) => {
    matchCommand(command, {
      async IDN() {
        setChannelDict({})

        if (account && identity) {
          const channelIds = await loadChannels(account, identity)
          for (const id of channelIds) {
            joinChannel(id)
          }
        }
        setChannelsLoaded(true)
      },

      JCH({ channel: id, character: { identity: name }, title }) {
        updateAtom(channelAtom(id), (channel) => ({
          ...channel,
          title,
          users: { ...channel.users, [name]: true },
          joinState: "joined",
        }))

        logger.setRoomName(`channel:${id}`, title)

        if (name === identity) {
          logger.getMessages(`channel:${id}`, 30).then((messages) => {
            updateAtom(channelAtom(id), (channel) => ({
              ...channel,
              previousMessages: messages,
            }))
          })
        }
      },

      LCH({ channel: id, character }) {
        updateAtom(channelAtom(id), (channel) => ({
          ...channel,
          joinState: character === identity ? "left" : channel.joinState,
          users: omit(channel.users, [character]),
        }))
      },

      FLN({ character }) {
        setChannelDict((channels) =>
          mapValues(channels, (channel) => ({
            ...channel,
            users: omit(channel.users, [character]),
          })),
        )
      },

      ICH({ channel: id, users, mode }) {
        updateAtom(channelAtom(id), (channel) => ({
          ...channel,
          mode,
          users: truthyMap(users.map((user) => user.identity)),
        }))
      },

      CDS({ channel: id, description }) {
        updateAtom(channelAtom(id), (channel) => ({
          ...channel,
          description,
        }))
      },

      RMO({ channel: id, mode }) {
        updateAtom(channelAtom(id), (channel) => ({
          ...channel,
          mode,
        }))
      },

      COL({ channel: id, oplist }) {
        updateAtom(channelAtom(id), (channel) => ({
          ...channel,
          ops: truthyMap(oplist),
        }))
      },

      MSG({ channel: id, message, character }) {
        addChannelMessage(id, createChannelMessage(character, message))
        updateAtom(channelAtom(id), (channel) => setRoomUnread(channel, true))
      },

      LRP({ channel: id, character, message }) {
        addChannelMessage(id, createAdMessage(character, message))
      },

      RLL(params) {
        if ("channel" in params) {
          // bottle messages have a lowercased channel id
          const id = params.channel.replace("adh", "ADH")
          addChannelMessage(id, createSystemMessage(params.message))
        }
      },

      CBU({ character, channel, operator }) {
        updateAtom(channelAtom(channel), (channel) => ({
          ...channel,
          users: omit(channel.users, [character]),
        }))

        updateAtom(channelAtom(channel), (channel) =>
          addRoomMessage(
            channel,
            createSystemMessage(
              `[user]${character}[/user] has been banned by [user]${operator}[/user]`,
            ),
          ),
        )
      },

      CKU({ character, channel, operator }) {
        updateAtom(channelAtom(channel), (channel) => ({
          ...channel,
          users: omit(channel.users, [character]),
        }))

        updateAtom(channelAtom(channel), (channel) =>
          addRoomMessage(
            channel,
            createSystemMessage(
              `[user]${character}[/user] has been kicked by [user]${operator}[/user]`,
            ),
          ),
        )
      },

      COA({ character, channel }) {
        updateAtom(channelAtom(channel), (channel) => ({
          ...channel,
          ops: { ...channel.ops, [character]: true },
        }))
        updateAtom(channelAtom(channel), (channel) =>
          addRoomMessage(
            channel,
            createSystemMessage(
              `[user]${character}[/user] is now a channel moderator`,
            ),
          ),
        )
      },

      COR({ character, channel }) {
        updateAtom(channelAtom(channel), (channel) => ({
          ...channel,
          ops: omit(channel.ops, [character]),
        }))
        updateAtom(channelAtom(channel), (channel) =>
          addRoomMessage(
            channel,
            createSystemMessage(
              `[user]${character}[/user] is no longer a channel moderator`,
            ),
          ),
        )
      },

      CSO({ character, channel }) {
        updateAtom(channelAtom(channel), (channel) =>
          addRoomMessage(
            channel,
            createSystemMessage(`[user]${character}[/user] is now the owner`),
          ),
        )
      },

      CTU({ character, channel, operator, length }) {
        updateAtom(channelAtom(channel), (channel) =>
          addRoomMessage(
            channel,
            createSystemMessage(
              `[user]${character}[/user] has been timed out by [user]${operator}[/user] for ${length} minutes`,
            ),
          ),
        )
      },
    })
  })
}
