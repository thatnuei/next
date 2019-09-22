import { Action } from "overmind"
import { State } from ".."
import createFactoryUpdate from "../../common/helpers/createFactoryUpdate"
import exists from "../../common/helpers/exists"
import { Dictionary } from "../../common/types"
import { errorCodes } from "../chat/constants"
import { createCommandHandler } from "../chat/helpers"
import { ServerCommand } from "../chat/types"
import { createChannel, createMessage } from "./helpers"
import { Channel } from "./types"

const createUpdateChannel = (state: State) =>
  createFactoryUpdate(
    state.channelStore.channels as Dictionary<Channel>,
    createChannel,
  )

export const joinChannel: Action<string> = ({ state, effects }, channelId) => {
  const updateChannel = createUpdateChannel(state)

  updateChannel(channelId, (channel) => {
    channel.joining = true
  })

  effects.chat.socket.sendCommand("JCH", { channel: channelId })
}

export const handleCommand: Action<ServerCommand> = ({ state }, command) => {
  const updateChannel = createUpdateChannel(state)

  const handler = createCommandHandler({
    JCH({ channel: id, character, title }) {
      updateChannel(id, (channel) => {
        channel.memberNames.push(character.identity)
        channel.title = title

        if (character.identity === state.chat.identity) {
          channel.joining = false
        }
      })
    },

    LCH({ channel: id, character }) {
      updateChannel(id, (channel) => {
        channel.memberNames = channel.memberNames.filter(
          (name) => name !== character,
        )
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

    ERR({ number }) {
      const joinFailureCodes = [
        errorCodes.alreadyInChannel,
        errorCodes.bannedFromChannel,
        errorCodes.canOnlyJoinChannelWithInvite,
        errorCodes.couldNotLocateChannel,
      ]

      if (joinFailureCodes.includes(number)) {
        Object.values(state.channelStore.channels as Dictionary<Channel>)
          .filter(exists)
          .forEach((channel) => (channel.joining = false))
      }
    },
  })

  handler(command)
}
