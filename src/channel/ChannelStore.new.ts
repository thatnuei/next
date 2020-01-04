import { observable } from "mobx"
import { createCommandHandler } from "../chat/helpers"
import { SocketStore } from "../chat/SocketStore.new"
import { createMessage } from "../message/helpers"
import { createChannel } from "./helpers"
import { Channel } from "./types"

export class ChannelStore {
  @observable
  private readonly channelsMap = new Map<string, Channel>()

  constructor(private socket: SocketStore) {}

  add = (char: Channel) => {
    this.channelsMap.set(char.name, char)
  }

  get = (name: string): Channel =>
    this.channelsMap.get(name) ?? createChannel(name)

  update = (name: string, update: (char: Channel) => void) => {
    const channel = this.get(name)
    update(channel)
    this.add(channel)
  }

  join = (id: string) => {
    this.socket.sendCommand("JCH", { channel: id })
  }

  leave = (id: string) => {
    this.socket.sendCommand("LCH", { channel: id })
  }

  get channels(): Channel[] {
    return [...this.channelsMap.values()]
  }

  handleSocketCommand = createCommandHandler({
    IDN: () => {
      this.join("Frontpage")
      this.join("Story Driven LFRP")
      this.join("Fantasy")
      this.join("RP Bar")
      this.join("RP Dark City")
      this.join("Development")
    },

    ICH: ({ channel: id, mode, users }) => {
      this.update(id, (channel) => {
        channel.mode = mode
        channel.users = new Set(users.map((it) => it.identity))
      })
    },

    CDS: ({ channel: id, description }) => {
      this.update(id, (channel) => {
        channel.description = description
      })
    },

    COL: ({ channel: id, oplist }) => {
      this.update(id, (channel) => {
        channel.ops = new Set(oplist)
      })
    },

    JCH: ({ channel: id, character: { identity }, title }) => {
      this.update(id, (channel) => {
        channel.name = title
        channel.users.add(identity)
      })
    },

    LCH: ({ channel: id, character }) => {
      this.update(id, (channel) => {
        channel.users.delete(character)
      })
    },

    FLN: ({ character }) => {
      for (const [, channel] of this.channelsMap) {
        channel.users.delete(character)
      }
    },

    MSG: ({ channel: id, character, message }) => {
      this.update(id, (channel) => {
        channel.messages.push(createMessage(character, message, "chat"))
      })
    },

    LRP: ({ channel: id, character, message }) => {
      this.update(id, (channel) => {
        channel.messages.push(createMessage(character, message, "lfrp"))
      })
    },

    RLL: (params) => {
      if ("channel" in params) {
        const { channel: id, message } = params
        this.update(id, (channel) => {
          channel.messages.push(createMessage(undefined, message, "system"))
        })
      }
    },
  })
}
