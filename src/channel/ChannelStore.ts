import { observable } from "mobx"
import { CharacterStore } from "../character/CharacterStore"
import { createCommandHandler } from "../chat/commands"
import { MessageModel } from "../message/MessageModel"
import { ChannelModel } from "./ChannelModel"

export class ChannelStore {
  constructor(
    private identity: string,
    private characterStore: CharacterStore,
  ) {}

  @observable.shallow
  channels: ChannelModel[] = []

  private updateChannel(id: string, doUpdate: (channel: ChannelModel) => void) {
    const channel = this.channels.find((it) => it.id === id)
    if (channel) {
      doUpdate(channel)
    }
  }

  handleCommand = createCommandHandler(this, {
    JCH({ channel: id, character: { identity }, title }) {
      if (identity === this.identity) {
        const channel = new ChannelModel(id, this.characterStore)
        this.channels.push(channel)
      }

      this.updateChannel(id, (channel) => {
        channel.title = title
        channel.users.add(identity)
      })
    },

    LCH({ channel: id, character }) {
      if (character === this.identity) {
        this.channels = this.channels.filter((it) => it.id !== id)
        return
      }

      this.updateChannel(id, (channel) => {
        channel.users.delete(character)
      })
    },

    FLN({ character }) {
      for (const channel of this.channels) {
        channel.users.delete(character)
      }
    },

    ICH({ channel: id, users, mode }) {
      this.updateChannel(id, (channel) => {
        channel.users.setAll(users.map((it) => it.identity))
        channel.mode = mode
      })
    },

    CDS({ channel: id, description }) {
      this.updateChannel(id, (channel) => {
        channel.description = description
      })
    },

    COL({ channel: id, oplist }) {
      this.updateChannel(id, (channel) => {
        channel.ops.setAll(oplist)
      })
    },

    MSG({ channel: id, character, message }) {
      this.updateChannel(id, (channel) => {
        channel.messageList.add(
          new MessageModel(character, message, "normal", Date.now()),
        )
      })
    },

    LRP({ channel: id, character, message }) {
      this.updateChannel(id, (channel) => {
        channel.messageList.add(
          new MessageModel(character, message, "lfrp", Date.now()),
        )
      })
    },

    RLL(params) {
      if ("channel" in params) {
        const { channel: id, message } = params

        this.updateChannel(id, (channel) => {
          channel.messageList.add(
            new MessageModel(undefined, message, "system", Date.now()),
          )
        })
      }
    },
  })
}
