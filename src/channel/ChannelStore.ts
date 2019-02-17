import { action, computed, observable } from "mobx"
import { createCommandHandler } from "../fchat/helpers"
import MessageModel from "../message/MessageModel"
import RootStore from "../RootStore"
import FactoryMap from "../state/FactoryMap"
import ChannelModel from "./ChannelModel"
import { ChannelMode } from "./types"

type ChannelListing = {
  id: string
  name: string
  userCount: number
  mode?: ChannelMode
}

export default class ChannelStore {
  channels = new FactoryMap(
    (id) => new ChannelModel(this.root.characterStore, id),
  )

  @observable.ref publicListings: ChannelListing[] = []
  @observable.ref privateListings: ChannelListing[] = []

  constructor(private root: RootStore) {}

  @computed
  get joinedChannels() {
    return this.channels.values.filter((channel) =>
      channel.users.has(this.root.chatStore.identity),
    )
  }

  requestListings() {
    this.root.socketStore.sendSocketCommand("CHA", undefined)
    this.root.socketStore.sendSocketCommand("ORS", undefined)
  }

  join(channelId: string) {
    this.root.socketStore.sendSocketCommand("JCH", { channel: channelId })
  }

  leave(channelId: string) {
    this.root.socketStore.sendSocketCommand("LCH", { channel: channelId })
  }

  isJoined(channelId: string) {
    return this.joinedChannels.some((channel) => channel.id === channelId)
  }

  @action
  handleSocketCommand = createCommandHandler({
    ICH: ({ channel: id, mode, users }) => {
      const channel = this.channels.get(id)
      channel.users.set(users.map(({ identity }) => identity))
      channel.setMode(mode)
    },

    CDS: ({ channel: id, description }) => {
      this.channels.update(id, (channel) => {
        channel.description = description
      })
    },

    COL: ({ channel: id, oplist }) => {
      const channel = this.channels.get(id)
      channel.ops.set(oplist)
    },

    JCH: ({ channel: id, character, title }) => {
      const channel = this.channels.get(id)
      channel.setName(title)
      channel.users.add(character.identity)
    },

    LCH: ({ channel: id, character }) => {
      const channel = this.channels.get(id)
      channel.users.remove(character)
    },

    FLN: ({ character }) => {
      for (const channel of this.channels.values) {
        channel.users.remove(character)
      }
    },

    MSG: ({ channel: id, character, message }) => {
      const channel = this.channels.get(id)
      channel.addMessage(new MessageModel(character, message, "chat"))
    },

    LRP: ({ channel: id, character, message }) => {
      const channel = this.channels.get(id)
      channel.addMessage(new MessageModel(character, message, "lfrp"))
    },

    CHA: ({ channels }) => {
      this.publicListings = channels.map(
        ({ name, mode, characters }): ChannelListing => ({
          id: name,
          name,
          mode,
          userCount: characters,
        }),
      )
    },

    ORS: ({ channels }) => {
      this.publicListings = channels.map(
        ({ name, title, characters }): ChannelListing => ({
          id: name,
          name: title,
          userCount: characters,
        }),
      )
    },
  })
}
