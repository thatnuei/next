import { action, computed, observable } from "mobx"
import { createCommandHandler } from "../chat/helpers"
import MessageModel from "../chat/MessageModel"
import RootStore from "../RootStore"
import FactoryMap from "../state/classes/FactoryMap"
import ChannelModel from "./ChannelModel"
import { ChannelBrowserEntry } from "./types"

type ChannelStoreListings = {
  public: ChannelBrowserEntry[]
  private: ChannelBrowserEntry[]
}

export default class ChannelStore {
  channels = new FactoryMap((id) => new ChannelModel(this.root, id))

  @observable.shallow
  listings: ChannelStoreListings = {
    public: [],
    private: [],
  }

  constructor(private root: RootStore) {
    // root.socketHandler.listen("command", this.handleSocketCommand)
  }

  @computed
  get joinedChannels() {
    return this.channels.values.filter((channel) => channel.isJoined)
  }

  @action
  private setListings(
    kind: keyof ChannelStoreListings,
    listings: ChannelBrowserEntry[],
  ) {
    this.listings[kind] = listings
  }

  requestListings = () => {
    this.root.socketStore.sendCommand("CHA", undefined)
    this.root.socketStore.sendCommand("ORS", undefined)
  }

  join(channelId: string) {
    this.root.socketStore.sendCommand("JCH", { channel: channelId })
  }

  leave(channelId: string) {
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

  showChannelBrowser = () => {
    this.root.chatOverlayStore.channelBrowser.show()
    this.requestListings()
  }

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
      channel.setName(title)
      channel.users.add(character.identity)

      if (character.identity === this.root.chatStore.identity) {
        // this.root.chatNavigationStore.addTab({
        //   type: "channel",
        //   channelId: id,
        // })
      }
    },

    LCH: ({ channel: id, character }) => {
      const channel = this.channels.get(id)
      channel.users.remove(character)

      // if (character === this.root.chatStore.identity) {
      //   this.root.chatNavigationStore.removeTab({
      //     type: "channel",
      //     channelId: id,
      //   })
      // }
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

    CHA: ({ channels }) => {
      const listings = channels.map<ChannelBrowserEntry>(
        ({ name, mode, characters }) => ({
          id: name,
          title: name,
          mode,
          userCount: characters,
        }),
      )
      this.setListings("public", listings)
    },

    ORS: ({ channels }) => {
      const listings = channels.map<ChannelBrowserEntry>(
        ({ name, title, characters }) => ({
          id: name,
          title,
          userCount: characters,
        }),
      )
      this.setListings("private", listings)
    },
  })
}
