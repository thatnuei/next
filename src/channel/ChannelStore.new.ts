import { observable } from "mobx"
import { createCommandHandler } from "../chat/helpers"
import { SocketStore } from "../chat/SocketStore.new"
import { createMessage } from "../message/helpers"
import { FactoryMap } from "../state/classes/FactoryMap.new"
import { createChannel } from "./helpers"
import { Channel } from "./types"

export class ChannelStore {
  @observable
  private readonly channels = new FactoryMap(createChannel)

  constructor(
    private readonly socket: SocketStore,
    private readonly identity: string,
  ) {}

  get = (id: string) => this.channels.get(id)

  join = (id: string) => {
    this.socket.sendCommand("JCH", { channel: id })
  }

  leave = (id: string) => {
    this.socket.sendCommand("LCH", { channel: id })
  }

  get joinedChannels(): Channel[] {
    return this.channels.values.filter((it) => it.users.has(this.identity))
  }

  handleSocketCommand = createCommandHandler({
    ICH: ({ channel: id, mode, users }) => {
      this.channels.update(id, (channel) => {
        channel.mode = mode
        channel.users = new Set(users.map((it) => it.identity))
      })
    },

    CDS: ({ channel: id, description }) => {
      this.channels.update(id, (channel) => {
        channel.description = description
      })
    },

    COL: ({ channel: id, oplist }) => {
      this.channels.update(id, (channel) => {
        channel.ops = new Set(oplist)
      })
    },

    JCH: ({ channel: id, character: { identity }, title }) => {
      this.channels.update(id, (channel) => {
        channel.name = title
        channel.users.add(identity)
      })
    },

    LCH: ({ channel: id, character }) => {
      this.channels.update(id, (channel) => {
        channel.users.delete(character)
      })
    },

    FLN: ({ character }) => {
      for (const channel of this.channels.values) {
        channel.users.delete(character)
      }
    },

    MSG: ({ channel: id, character, message }) => {
      this.channels.update(id, (channel) => {
        channel.messages.push(createMessage(character, message, "chat"))
      })
    },

    LRP: ({ channel: id, character, message }) => {
      this.channels.update(id, (channel) => {
        channel.messages.push(createMessage(character, message, "lfrp"))
      })
    },

    RLL: (params) => {
      if ("channel" in params) {
        const { channel: id, message } = params
        this.channels.update(id, (channel) => {
          channel.messages.push(createMessage(undefined, message, "system"))
        })
      }
    },
  })
}
