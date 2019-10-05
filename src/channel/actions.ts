import { Action, AsyncAction } from "overmind"
import { errorCodes } from "../chat/constants"
import { createCommandHandler } from "../chat/helpers"
import { ServerCommand } from "../chat/types"
import createFactoryUpdate from "../common/helpers/createFactoryUpdate"
import exists from "../common/helpers/exists"
import sleep from "../common/helpers/sleep"
import { Dictionary } from "../common/types"
import { StoreState } from "../store"
import { createChannel, createMessage } from "./helpers"
import { Channel, ChannelBrowserEntry } from "./types"

const createUpdateChannel = (state: StoreState) =>
  createFactoryUpdate(
    state.channel.channels as Dictionary<Channel>,
    createChannel,
  )

export const joinChannel: Action<string> = ({ state, effects }, channelId) => {
  const updateChannel = createUpdateChannel(state)

  updateChannel(channelId, (channel) => {
    channel.entryAction = "joining"
  })

  effects.chat.socket.sendCommand("JCH", { channel: channelId })
}

export const leaveChannel: Action<string> = ({ state, effects }, channelId) => {
  const updateChannel = createUpdateChannel(state)

  updateChannel(channelId, (channel) => {
    channel.entryAction = "leaving"
  })

  effects.chat.socket.sendCommand("LCH", { channel: channelId })
}

export const requestAvailableChannels: AsyncAction = async ({
  state,
  effects,
}) => {
  if (state.channel.fetchingAvailableChannels) return

  state.channel.fetchingPublicChannels = true
  state.channel.fetchingPrivateChannels = true

  effects.chat.socket.sendCommand("CHA", undefined)
  effects.chat.socket.sendCommand("ORS", undefined)

  // failsafe in case it takes a while
  await sleep(3000)
  state.channel.fetchingPublicChannels = false
  state.channel.fetchingPrivateChannels = false
}

export const showChannelBrowser: Action = ({ state, actions }) => {
  state.app.modal = { type: "channelBrowser" }
  actions.channel.requestAvailableChannels()
}

export const hideChannelBrowser: Action = ({ state }) => {
  state.app.modal = undefined
}

export const handleCommand: Action<ServerCommand> = ({ state }, command) => {
  const updateChannel = createUpdateChannel(state)

  const handler = createCommandHandler({
    JCH({ channel: id, character, title }) {
      updateChannel(id, (channel) => {
        channel.memberNames.push(character.identity)
        channel.title = title

        if (character.identity === state.chat.identity) {
          channel.entryAction = undefined
        }
      })
    },

    LCH({ channel: id, character }) {
      updateChannel(id, (channel) => {
        channel.memberNames = channel.memberNames.filter(
          (name) => name !== character,
        )

        if (character === state.chat.identity) {
          channel.entryAction = undefined
        }
      })
    },

    ICH({ channel: id, mode, users }) {
      updateChannel(id, (channel) => {
        channel.mode = mode
        channel.memberNames = users.map((user) => user.identity)
      })
    },

    CDS({ channel: id, description }) {
      updateChannel(id, (channel) => {
        channel.description = description
      })
    },

    MSG({ channel: id, character, message }) {
      updateChannel(id, (channel) => {
        channel.messages.push(createMessage(character, message, "chat"))
      })
    },

    LRP({ channel: id, character, message }) {
      updateChannel(id, (channel) => {
        channel.messages.push(createMessage(character, message, "lfrp"))
      })
    },

    CHA({ channels }) {
      state.channel.availableChannels.public = channels.map<
        ChannelBrowserEntry
      >((entry) => ({
        id: entry.name,
        title: entry.name,
        userCount: entry.characters,
        mode: entry.mode,
      }))
      state.channel.fetchingPublicChannels = false
    },

    ORS({ channels }) {
      state.channel.availableChannels.private = channels.map<
        ChannelBrowserEntry
      >((entry) => ({
        id: entry.name,
        title: entry.title,
        userCount: entry.characters,
      }))
      state.channel.fetchingPrivateChannels = false
    },

    ERR({ number }) {
      const joinFailureCodes = [
        errorCodes.alreadyInChannel,
        errorCodes.bannedFromChannel,
        errorCodes.canOnlyJoinChannelWithInvite,
        errorCodes.couldNotLocateChannel,
      ]

      if (joinFailureCodes.includes(number)) {
        Object.values(state.channel.channels as Dictionary<Channel>)
          .filter(exists)
          .forEach((channel) => (channel.entryAction = undefined))
      }
    },
  })

  handler(command)
}
