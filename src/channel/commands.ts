import { ChatState } from "../chat/ChatState"
import { createCommandHandler } from "../chat/commandHelpers"
import { MessageModel } from "../message/MessageModel"
import { ChannelModel } from "./ChannelModel"

export function createChannelCommandHandler(
  state: ChatState,
  identity: string,
) {
  function updateChannel(
    id: string,
    doUpdate: (channel: ChannelModel) => void,
  ) {
    const channel = state.channels.find((it) => it.id === id)
    if (channel) {
      doUpdate(channel)
    }
  }

  return createCommandHandler(undefined, {
    JCH({ channel: id, character: { identity: name }, title }) {
      if (name === identity) {
        const channel = new ChannelModel(id)
        state.channels.push(channel)
      }

      updateChannel(id, (channel) => {
        channel.title = title
        channel.users.add(name)
      })
    },

    LCH({ channel: id, character }) {
      if (character === identity) {
        state.channels = state.channels.filter((it) => it.id !== id)
        return
      }

      updateChannel(id, (channel) => {
        channel.users.delete(character)
      })
    },

    FLN({ character }) {
      for (const channel of state.channels) {
        channel.users.delete(character)
      }
    },

    ICH({ channel: id, users, mode }) {
      updateChannel(id, (channel) => {
        channel.users = new Set(users.map((it) => it.identity))
        channel.mode = mode
      })
    },

    CDS({ channel: id, description }) {
      updateChannel(id, (channel) => {
        channel.description = description
      })
    },

    COL({ channel: id, oplist }) {
      updateChannel(id, (channel) => {
        channel.ops = new Set(oplist)
      })
    },

    MSG({ channel: id, character, message }) {
      updateChannel(id, (channel) => {
        channel.messageList.add(
          new MessageModel(character, message, "normal", Date.now()),
        )
      })
    },

    LRP({ channel: id, character, message }) {
      updateChannel(id, (channel) => {
        channel.messageList.add(
          new MessageModel(character, message, "lfrp", Date.now()),
        )
      })
    },

    RLL(params) {
      if ("channel" in params) {
        const { channel: id, message } = params

        updateChannel(id, (channel) => {
          channel.messageList.add(
            new MessageModel(undefined, message, "system", Date.now()),
          )
        })
      }
    },
  })
}
