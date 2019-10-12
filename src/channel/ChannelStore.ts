import { action, computed } from "mobx"
import { createCommandHandler } from "../chat/helpers"
import MessageModel from "../chat/MessageModel"
import RootStore from "../RootStore"
import FactoryMap from "../state/classes/FactoryMap"
import ChannelModel from "./ChannelModel"

export default class ChannelStore {
  channels = new FactoryMap((id) => new ChannelModel(this.root, id))

  constructor(private root: RootStore) {
    // root.socketHandler.listen("command", this.handleSocketCommand)
  }

  @computed
  get joinedChannels() {
    return this.channels.values.filter((channel) => {
      return channel.joinState !== "left"
    })
  }

  @action
  join = (channelId: string) => {
    this.channels.get(channelId).joinState = "joining"
    this.root.socketStore.sendCommand("JCH", { channel: channelId })
  }

  @action
  leave = (channelId: string) => {
    this.channels.get(channelId).joinState = "leaving"
    this.root.socketStore.sendCommand("LCH", { channel: channelId })
  }

  sendMessage(channelId: string, message: string) {
    this.root.socketStore.sendCommand("MSG", { channel: channelId, message })
    this.channels
      .get(channelId)
      .addMessage(
        new MessageModel(this.root.chatStore.identity, message, "chat"),
      )
  }

  sendRoll(channelId: string, dice: string) {
    this.root.socketStore.sendCommand("RLL", { channel: channelId, dice })
  }

  sendBottle(channelId: string) {
    this.root.socketStore.sendCommand("RLL", {
      channel: channelId,
      dice: "bottle",
    })
  }

  @action
  handleSocketCommand = createCommandHandler({
    ICH: ({ channel: id, mode, users }) => {
      const channel = this.channels.get(id)
      channel.users.set(users.map(({ identity }) => identity))
      channel.setMode(mode)
    },

    CDS: ({ channel: id, description }) => {
      const channel = this.channels.get(id)
      channel.setDescription(description)
    },

    COL: ({ channel: id, oplist }) => {
      const channel = this.channels.get(id)
      channel.ops.set(oplist)
    },

    JCH: ({ channel: id, character, title }) => {
      const channel = this.channels.get(id)
      if (character.identity === this.root.chatStore.identity) {
        channel.joinState = "joined"
      } else {
        channel.setName(title)
        channel.users.add(character.identity)
      }
    },

    LCH: ({ channel: id, character }) => {
      const channel = this.channels.get(id)
      if (character === this.root.chatStore.identity) {
        channel.joinState = "left"
      } else {
        channel.users.remove(character)
      }
    },

    FLN: ({ character }) => {
      for (const channel of this.channels.values) {
        channel.users.remove(character)
      }
    },

    MSG: ({ channel: id, character, message }) => {
      const channel = this.channels.get(id)
      channel.addMessage(new MessageModel(character, message, "chat"))

      // const isChannelActive = this.root.chatNavigationStore.isActive({
      //   type: "channel",
      //   channelId: id,
      // })
      // if (!isChannelActive) {
      //   channel.markUnread()
      // }
    },

    LRP: ({ channel: id, character, message }) => {
      const channel = this.channels.get(id)
      channel.addMessage(new MessageModel(character, message, "lfrp"))
    },

    RLL: (params) => {
      if ("channel" in params) {
        const channel = this.channels.get(params.channel)
        const message = new MessageModel(undefined, params.message, "system")
        channel.addMessage(message)
      }
    },
  })
}
