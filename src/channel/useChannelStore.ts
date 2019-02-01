import exists from "../common/exists"
import createCommandHandler from "../fchat/createCommandHandler"
import { Message, MessageType } from "../message/types"
import FactoryMap from "../state/FactoryMap"
import useInstanceValue from "../state/useInstanceValue"
import { Channel, ChannelMode } from "./types"

export default function useChannelStore(identity: string) {
  const channels = useInstanceValue(() => new FactoryMap(createChannel))

  function getJoinedChannels() {
    return channels.values.filter((ch) => ch.users[identity])
  }

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
    },

    LCH({ channel: id, character }) {
      channels.update(id, (channel) => {
        delete channel.users[character]
      })
    },

    FLN({ character }) {
      for (const ch of channels.values.filter(exists)) {
        delete ch.users[character]
      }
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

  return { channels, getJoinedChannels, handleCommand, setSelectedMode }
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
