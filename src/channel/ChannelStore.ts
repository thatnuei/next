import { action, observable } from "mobx"
import { createCommandHandler } from "../fchat/helpers"
import MessageModel from "../message/MessageModel"
import RootStore from "../RootStore"
import FactoryMap from "../state/FactoryMap"
import ChannelModel from "./ChannelModel"
import { ChannelMode } from "./types"

export type ChannelListing = {
  id: string
  name: string
  userCount: number
  mode?: ChannelMode
}

type ChannelStoreListings = {
  public: ChannelListing[]
  private: ChannelListing[]
}

export type ChannelListingType = keyof ChannelStoreListings

export default class ChannelStore {
  channels = new FactoryMap((id) => new ChannelModel(this.root, id))

  @observable.shallow
  listings: ChannelStoreListings = {
    public: [],
    private: [],
  }

  constructor(private root: RootStore) {
    root.socketHandler.listen("command", this.handleSocketCommand)
  }

  @action
  private setListings(
    kind: keyof ChannelStoreListings,
    listings: ChannelListing[],
  ) {
    this.listings[kind] = listings
  }

  requestListings = () => {
    this.root.socketHandler.send("CHA", undefined)
    this.root.socketHandler.send("ORS", undefined)
  }

  async join(channelId: string) {
    const { socketHandler, chatStore } = this.root

    socketHandler.send("JCH", { channel: channelId })

    while (true) {
      const result = await Promise.race([
        socketHandler.waitForEvent("JCH"),
        socketHandler.waitForEvent("ERR"),
      ])

      if (result.type === "JCH") {
        const params = result.value

        const isSelf =
          params.channel === channelId &&
          params.character.identity === chatStore.identity

        if (isSelf) {
          break
        }
      }

      if (result.type === "ERR") {
        const params = result.value

        // https://wiki.f-list.net/F-Chat_Error_Codes
        const joinErrors = [26, 28, 44, 48]
        if (joinErrors.includes(params.number)) {
          throw new Error(params.message)
        }
      }
    }
  }

  async leave(channelId: string) {
    const { socketHandler, chatStore } = this.root

    socketHandler.send("LCH", { channel: channelId })

    while (true) {
      const result = await Promise.race([
        socketHandler.waitForEvent("LCH"),
        socketHandler.waitForEvent("ERR"),
      ])

      if (result.type === "LCH") {
        const params = result.value

        const isSelf =
          params.channel === channelId &&
          params.character === chatStore.identity

        if (isSelf) {
          break
        }
      }

      if (result.type === "ERR") {
        const params = result.value

        // https://wiki.f-list.net/F-Chat_Error_Codes
        const leaveErrors = [49]
        if (leaveErrors.includes(params.number)) {
          throw new Error(params.message)
        }
      }
    }
  }

  sendMessage(channelId: string, message: string) {
    this.root.socketHandler.send("MSG", { channel: channelId, message })
    this.channels
      .get(channelId)
      .addMessage(
        new MessageModel(this.root.chatStore.identity, message, "chat"),
      )
  }

  sendRoll(channelId: string, dice: string) {
    this.root.socketHandler.send("RLL", { channel: channelId, dice })
  }

  sendBottle(channelId: string) {
    this.root.socketHandler.send("RLL", { channel: channelId, dice: "bottle" })
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
        this.root.chatNavigationStore.addTab({
          type: "channel",
          channelId: id,
        })
      }
    },

    LCH: ({ channel: id, character }) => {
      const channel = this.channels.get(id)
      channel.users.remove(character)

      if (character === this.root.chatStore.identity) {
        this.root.chatNavigationStore.removeTab({
          type: "channel",
          channelId: id,
        })
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

      const isChannelActive = this.root.chatNavigationStore.isActive({
        type: "channel",
        channelId: id,
      })
      if (!isChannelActive) {
        channel.markUnread()
      }
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
      const listings = channels.map<ChannelListing>(
        ({ name, mode, characters }) => ({
          id: name,
          name,
          mode,
          userCount: characters,
        }),
      )
      this.setListings("public", listings)
    },

    ORS: ({ channels }) => {
      const listings = channels.map<ChannelListing>(
        ({ name, title, characters }) => ({
          id: name,
          name: title,
          userCount: characters,
        }),
      )
      this.setListings("private", listings)
    },
  })
}
