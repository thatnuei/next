import { useImmer } from "use-immer"
import exists from "../common/exists"
import { Dictionary, Mutable } from "../common/types"
import createCommandHandler from "../fchat/createCommandHandler"
import { Channel } from "./types"

function createChannel(id: string): Channel {
  return {
    id,
    name: id,
    description: "",
    messages: [],
    mode: "both",
    ops: {},
    users: {},
  }
}

export default function useChannelStore(identity?: string) {
  const [channels, updateChannels] = useImmer<Dictionary<Channel>>({})
  const [joinedChannels, updateJoinedChannels] = useImmer<Dictionary<true>>({})

  function getChannel(id: string) {
    return channels[id] || createChannel(id)
  }

  function updateChannel(
    id: string,
    update: (channel: Mutable<Channel>) => Channel | void,
  ) {
    updateChannels((channels) => {
      const channel = channels[id] || createChannel(id)
      channels[id] = update(channel) || channel
    })
  }

  const handleCommand = createCommandHandler({
    ICH({ channel: id, mode, users }) {
      updateChannel(id, (channel) => {
        channel.mode = mode
        channel.users = {}
        for (const { identity } of users) channel.users[identity] = true
      })
    },

    CDS({ channel: id, description }) {
      updateChannel(id, (channel) => {
        channel.description = description
      })
    },

    COL({ channel: id, oplist }) {
      updateChannel(id, (channel) => {
        channel.ops = {}
        for (const name of oplist) channel.ops[name] = true
      })
    },

    JCH({ channel: id, character, title }) {
      updateChannel(id, (channel) => {
        channel.name = title
        channel.users[character.identity] = true
      })

      if (character.identity === identity) {
        updateJoinedChannels((draft) => {
          draft[id] = true
        })
      }
    },

    LCH({ channel: id, character }) {
      updateChannel(id, (channel) => {
        delete channel.users[character]
      })

      if (character === identity) {
        updateJoinedChannels((draft) => {
          delete draft[id]
        })
      }
    },

    FLN({ character }) {
      updateChannels((channels) => {
        for (const ch of Object.values(channels).filter(exists)) {
          delete ch.users[character]
        }
      })
    },

    MSG({ channel: id, character, message }) {
      updateChannel(id, (channel) => {
        channel.messages.push({
          sender: character,
          text: message,
          type: "chat",
          time: Date.now(),
        })
      })
    },

    LRP({ channel: id, character, message }) {
      updateChannel(id, (channel) => {
        channel.messages.push({
          sender: character,
          text: message,
          type: "lfrp",
          time: Date.now(),
        })
      })
    },
  })

  return { channels, updateChannels, getChannel, joinedChannels, handleCommand }
}
