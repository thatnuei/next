import { mapValues, omit } from "lodash-es"
import type { CharacterStore } from "../character/CharacterStore"
import { truthyMap } from "../common/truthyMap"
import type { ChatLogger } from "../logging/logger"
import type { MessageState } from "../message/MessageState"
import {
  createAdMessage,
  createChannelMessage,
  createSystemMessage,
} from "../message/MessageState"
import {
  addRoomMessage,
  clearRoomMessages,
  createRoomState,
  setRoomUnread,
} from "../room/state"
import type { ChatSocket } from "../socket/ChatSocket"
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import { createDictStore } from "../state/dict-store"
import type { InputState } from "../state/input"
import { combineStores } from "../state/store"
import { loadChannels, saveChannels } from "./storage"
import type { Channel, ChannelMode } from "./types"

export type ChannelStore = ReturnType<typeof createChannelStore>

function createChannel(id: string): Channel {
  return {
    id,
    title: id,
    description: "",
    mode: "both",
    selectedMode: "chat",
    users: {},
    ops: {},
    joinState: "absent",
    ...createRoomState(),
  }
}

export function createChannelStore(
  identity: string,
  socket: ChatSocket,
  logger: ChatLogger,
  characterStore: CharacterStore,
) {
  const channels = createDictStore(createChannel)
  let restored = false

  const store = {
    channels,

    selectJoinedChannels() {
      return channels.selectValues().select((channels) => {
        return channels.filter(
          (channel) =>
            channel.joinState === "joining" || channel.joinState === "present",
        )
      })
    },

    selectChannelCharacters(id: string) {
      return combineStores(
        channels.selectItem(id),
        characterStore.characters,
      ).select(([channel, characters]) =>
        characterStore.getCharacterList(characters, Object.keys(channel.users)),
      )
    },

    selectActualChannelMode(id: string) {
      return channels
        .selectItem(id)
        .select((channel) =>
          channel.mode === "both" ? channel.selectedMode : channel.mode,
        )
    },

    join(id: string, title?: string) {
      socket.send({
        type: "JCH",
        params: { channel: id },
      })

      channels.updateItem(id, (channel) => ({
        ...channel,
        joinState: "joining",
        title: title || channel.title,
      }))
    },

    leave(id: string) {
      socket.send({
        type: "LCH",
        params: { channel: id },
      })

      channels.updateItem(id, (channel) => ({
        ...channel,
        joinState: "leaving",
      }))
    },

    addMessage(id: string, message: MessageState) {
      channels.updateItem(id, (channel) => addRoomMessage(channel, message))
      logger.addMessage(`channel:${id}:${identity}`, message)
    },

    clearMessages(id: string) {
      channels.updateItem(id, clearRoomMessages)
    },

    sendMessage(id: string, message: string) {
      const rollPrefix = "/roll"
      if (message.startsWith(rollPrefix)) {
        const dice = message.slice(rollPrefix.length).trim() || "1d20"
        socket.send({
          type: "RLL",
          params: { channel: id, dice },
        })
        return
      }

      const bottlePrefix = "/bottle"
      if (message.startsWith(bottlePrefix)) {
        socket.send({
          type: "RLL",
          params: { channel: id, dice: "bottle" },
        })
        return
      }

      socket.send({ type: "MSG", params: { channel: id, message } })
      store.addMessage(id, createChannelMessage(identity, message))
    },

    setSelectedMode(id: string, mode: ChannelMode) {
      channels.updateItem(id, (channel) => ({
        ...channel,
        selectedMode: mode,
      }))
    },

    setInputState(id: string, input: InputState) {
      channels.updateItem(id, (channel) => ({ ...channel, input }))
    },

    markRead(id: string) {
      channels.updateItem(id, (channel) => setRoomUnread(channel, false))
    },

    handleCommand(command: ServerCommand) {
      function saveIfRestored() {
        if (!restored) return
        saveChannels(
          store.selectJoinedChannels().value.map((ch) => ch.id),
          identity,
        )
      }

      matchCommand(command, {
        IDN() {
          loadChannels(identity)
            .then((channels) => {
              for (const id of channels) {
                store.join(id)
              }
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.warn("Could not load channels", error)
            })
            .finally(() => {
              restored = true
            })
        },

        JCH({ channel: id, character: { identity: name }, title }) {
          channels.updateItem(id, (channel) => ({
            ...channel,
            title,
            users: { ...channel.users, [name]: true },
            joinState: "present",
          }))

          if (name === identity) {
            logger.setRoomName(
              `channel:${id}:${identity}`,
              `${title} (on ${identity})`,
            )

            logger
              .getMessages(`channel:${id}:${identity}`, 30)
              .then((messages) => {
                channels.updateItem(id, (channel) => ({
                  ...channel,
                  messages,
                }))
              })

            saveIfRestored()
          }
        },

        LCH({ channel: id, character }) {
          channels.updateItem(id, (channel) => ({
            ...channel,
            joinState: character === identity ? "absent" : channel.joinState,
            users: omit(channel.users, [character]),
          }))

          if (character === identity) {
            saveIfRestored()
          }
        },

        FLN({ character }) {
          channels.update((channels) =>
            mapValues(channels, (channel) => ({
              ...channel,
              users: omit(channel.users, [character]),
            })),
          )
        },

        ICH({ channel: id, users, mode }) {
          channels.updateItem(id, (channel) => ({
            ...channel,
            mode,
            users: truthyMap(users.map((user) => user.identity)),
          }))
        },

        CDS({ channel: id, description }) {
          channels.updateItem(id, (channel) => ({
            ...channel,
            description,
          }))
        },

        RMO({ channel: id, mode }) {
          channels.updateItem(id, (channel) => ({
            ...channel,
            mode,
          }))
        },

        COL({ channel: id, oplist }) {
          channels.updateItem(id, (channel) => ({
            ...channel,
            ops: truthyMap(oplist),
          }))
        },

        MSG({ channel: id, message, character }) {
          store.addMessage(id, createChannelMessage(character, message))
          channels.updateItem(id, (channel) => setRoomUnread(channel, true))
        },

        LRP({ channel: id, character, message }) {
          store.addMessage(id, createAdMessage(character, message))
        },

        RLL(params) {
          if ("channel" in params) {
            // bottle messages have a lowercased channel id
            const id = params.channel.replace("adh", "ADH")
            store.addMessage(id, createSystemMessage(params.message))
          }
        },

        CBU({ character, channel, operator }) {
          channels.updateItem(channel, (channel) => ({
            ...channel,
            users: omit(channel.users, [character]),
          }))

          channels.updateItem(channel, (channel) =>
            addRoomMessage(
              channel,
              createSystemMessage(
                `[user]${character}[/user] has been banned by [user]${operator}[/user]`,
              ),
            ),
          )
        },

        CKU({ character, channel, operator }) {
          channels.updateItem(channel, (channel) => ({
            ...channel,
            users: omit(channel.users, [character]),
          }))

          channels.updateItem(channel, (channel) =>
            addRoomMessage(
              channel,
              createSystemMessage(
                `[user]${character}[/user] has been kicked by [user]${operator}[/user]`,
              ),
            ),
          )
        },

        COA({ character, channel }) {
          channels.updateItem(channel, (channel) => ({
            ...channel,
            ops: { ...channel.ops, [character]: true },
          }))
          channels.updateItem(channel, (channel) =>
            addRoomMessage(
              channel,
              createSystemMessage(
                `[user]${character}[/user] is now a channel moderator`,
              ),
            ),
          )
        },

        COR({ character, channel }) {
          channels.updateItem(channel, (channel) => ({
            ...channel,
            ops: omit(channel.ops, [character]),
          }))
          channels.updateItem(channel, (channel) =>
            addRoomMessage(
              channel,
              createSystemMessage(
                `[user]${character}[/user] is no longer a channel moderator`,
              ),
            ),
          )
        },

        CSO({ character, channel }) {
          channels.updateItem(channel, (channel) =>
            addRoomMessage(
              channel,
              createSystemMessage(`[user]${character}[/user] is now the owner`),
            ),
          )
        },

        CTU({ character, channel, operator, length }) {
          channels.updateItem(channel, (channel) =>
            addRoomMessage(
              channel,
              createSystemMessage(
                `[user]${character}[/user] has been timed out by [user]${operator}[/user] for ${length} minutes`,
              ),
            ),
          )
        },
      })
    },
  }

  return store
}
