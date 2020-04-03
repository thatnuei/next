import { action, observable } from "mobx"
import { ChatState } from "../chat/ChatState"
import { createCommandHandler } from "../chat/commandHelpers"
import { useChatContext } from "../chat/context"
import { MessageListModel } from "../message/MessageListModel"

export class ChannelModel {
  constructor(public readonly id: string) {}

  @observable title = ""
  @observable description = ""
  @observable.shallow messageList = new MessageListModel()
  @observable mode: ChannelMode = "both"
  @observable selectedMode: ChannelMode = "both"

  @observable.shallow users = new Set<string>()
  @observable.shallow ops = new Set<string>()

  @action
  setSelectedMode = (mode: ChannelMode) => {
    this.selectedMode = mode
  }
}

export type ChannelMode = "both" | "chat" | "ads"

// IDEA: might be worth making a version of this which "binds" the helpers to a
// given channel id? could make things nicer
export function useChannels() {
  const { state, socket } = useChatContext()
  return {
    isJoined(id: string) {
      return state.roomList.find(`channel-${id}`)
    },

    join(id: string) {
      socket.send({ type: "JCH", params: { channel: id } })
    },

    leave(id: string) {
      socket.send({ type: "LCH", params: { channel: id } })
    },
  }
}

export function createChannelCommandHandler({ channels }: ChatState) {
  return createCommandHandler({
    JCH({ channel: id, character: { identity: name }, title }) {
      channels.update(id, (channel) => {
        channel.title = title
        channel.users.add(name)
      })
    },

    LCH({ channel: id, character }) {
      channels.update(id, (channel) => {
        channel.users.delete(character)
      })
    },

    FLN({ character }) {
      for (const channel of channels.values()) {
        channel.users.delete(character)
      }
    },

    ICH({ channel: id, users, mode }) {
      channels.update(id, (channel) => {
        channel.users = new Set(users.map((it) => it.identity))
        channel.mode = mode
      })
    },

    CDS({ channel: id, description }) {
      channels.update(id, (channel) => {
        channel.description = description
      })
    },

    COL({ channel: id, oplist }) {
      channels.update(id, (channel) => {
        channel.ops = new Set(oplist)
      })
    },

    MSG({ channel: id, character, message }) {
      channels.update(id, (channel) => {
        channel.messageList.add(character, message, "normal", Date.now())
      })
    },

    LRP({ channel: id, character, message }) {
      channels.update(id, (channel) => {
        channel.messageList.add(character, message, "lfrp", Date.now())
      })
    },

    RLL(params) {
      if ("channel" in params) {
        const { channel: id, message } = params

        channels.update(id, (channel) => {
          channel.messageList.add(undefined, message, "system", Date.now())
        })
      }
    },
  })
}
