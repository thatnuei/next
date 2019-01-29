import { useImmer } from "use-immer"
import exists from "../common/exists"
import { Dictionary } from "../common/types"
import createCommandHandler from "../fchat/createCommandHandler"
import { Message, MessageType } from "../message/types"
import useFactoryMap from "../state/useFactoryMap"
import { Channel, ChannelMode } from "./types"

export default function useChannelStore(identity?: string) {
  const channels = useFactoryMap(createChannel)
  const [joinedChannels, updateJoinedChannels] = useImmer<Dictionary<true>>({})

  function setSelectedMode(channelId: string, mode: ChannelMode) {
    channels.update(channelId, (channel) => {
      channel.selectedMode = mode
    })
  }

  const handleCommand = createCommandHandler({
    ICH({ channel: id, mode, users }) {
      channels.update(id, (channel) => {
        channel.mode = mode
        channel.selectedMode = "chat"
        channel.users = {}
        for (const { identity } of users) channel.users[identity] = true
      })
    },

    CDS({ channel: id, description }) {
      channels.update(id, (channel) => {
        channel.description = description
      })
    },

    COL({ channel: id, oplist }) {
      channels.update(id, (channel) => {
        channel.ops = {}
        for (const name of oplist) channel.ops[name] = true
      })
    },

    JCH({ channel: id, character, title }) {
      channels.update(id, (channel) => {
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
      channels.update(id, (channel) => {
        delete channel.users[character]
      })

      if (character === identity) {
        updateJoinedChannels((draft) => {
          delete draft[id]
        })
      }
    },

    FLN({ character }) {
      channels.updateAll((channels) => {
        for (const ch of Object.values(channels).filter(exists)) {
          delete ch.users[character]
        }
      })
    },

    MSG({ channel: id, character, message }) {
      channels.update(id, (channel) => {
        channel.messages.push(createMessage(character, message, "chat"))
      })
    },

    LRP({ channel: id, character, message }) {
      channels.update(id, (channel) => {
        channel.messages.push(createMessage(character, message, "lfrp"))
      })
    },
  })

  return { channels, joinedChannels, handleCommand, setSelectedMode }
}

function createChannel(id: string): Channel {
  return {
    id,
    name: id,
    description: "",
    messages: [],
    mode: "both",
    selectedMode: "both",
    ops: {},
    users: {},
  }
}

function createMessage(
  senderName: string,
  text: string,
  type: MessageType,
): Message {
  return {
    id: String(Math.random()),
    time: Date.now(),
    senderName,
    text,
    type,
  }
}
