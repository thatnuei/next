import { action, computed, observable } from "mobx"
import { AppStore } from "../app/AppStore"
import { ServerCommands } from "../fchat/types"
import { MessageModel, MessageModelOptions } from "../message/MessageModel"
import { ChannelModel } from "./ChannelModel"

export class ChannelStore {
  @observable
  channels = new Map<string, ChannelModel>()

  private joinedChannelIds = observable.map<string, true>()

  constructor(private appStore: AppStore) {
    appStore.socketEvents.listen("JCH", this.handleJoin)
    appStore.socketEvents.listen("LCH", this.handleLeave)
    appStore.socketEvents.listen("ICH", this.handleInitialChannelInfo)
    appStore.socketEvents.listen("CDS", this.handleChannelDescription)
    appStore.socketEvents.listen("COL", this.handleOpList)
    appStore.socketEvents.listen("MSG", this.handleNormalMessage)
    appStore.socketEvents.listen("LRP", this.handleAdMessage)
    appStore.socketEvents.listen("FLN", this.handleLogout)
    appStore.socketEvents.listen("IDN", this.restoreJoinedChannels)
  }

  @action.bound
  getChannel(id: string) {
    const channel = this.channels.get(id) || new ChannelModel(id)
    this.channels.set(id, channel)
    return channel
  }

  @computed
  get joinedChannels() {
    return [...this.joinedChannelIds.keys()].map(this.getChannel)
  }

  joinChannel(id: string) {
    this.appStore.sendCommand("JCH", { channel: id })
  }

  leaveChannel(id: string) {
    this.appStore.sendCommand("LCH", { channel: id })
  }

  isJoined(id: string) {
    return this.joinedChannelIds.has(id)
  }

  private get storedChannelsKey() {
    return `joinedChannels:${this.appStore.identity}`
  }

  private saveJoinedChannels() {
    const channelIds = [...this.joinedChannelIds.keys()]
    localStorage.setItem(this.storedChannelsKey, JSON.stringify(channelIds))
  }

  private restoreJoinedChannels = () => {
    let channelIds: string[] = []
    try {
      const storedChannels = localStorage.getItem(this.storedChannelsKey)
      channelIds = JSON.parse(storedChannels || "[]")
    } catch (error) {
      console.warn("Error loading channels:", error)
    }

    for (const id of channelIds) {
      this.joinChannel(id)
    }
  }

  @action
  private addChannelMessage = (channelId: string, options: MessageModelOptions) => {
    const channel = this.getChannel(channelId)
    channel.addMessage(new MessageModel(options))
  }

  @action.bound
  private handleJoin(params: ServerCommands["JCH"]) {
    const channel = this.getChannel(params.channel)
    channel.title = params.title
    channel.type = params.channel === params.title ? "public" : "private"
    channel.addUser(params.character.identity)

    if (params.character.identity === this.appStore.identity) {
      this.joinedChannelIds.set(params.channel, true)
      this.saveJoinedChannels()
    }
  }

  @action.bound
  private handleLeave(params: ServerCommands["LCH"]) {
    const channel = this.getChannel(params.channel)
    channel.removeUser(params.character)

    if (params.character === this.appStore.identity) {
      this.joinedChannelIds.delete(params.channel)
      this.saveJoinedChannels()
    }
  }

  @action.bound
  private handleLogout(params: ServerCommands["FLN"]) {
    for (const channel of this.channels.values()) {
      channel.removeUser(params.character)
    }
  }

  @action.bound
  private handleInitialChannelInfo(params: ServerCommands["ICH"]) {
    const channel = this.getChannel(params.channel)
    channel.setUsers(params.users.map((user) => user.identity))
    channel.mode = params.mode
  }

  @action.bound
  private handleChannelDescription(params: ServerCommands["CDS"]) {
    const channel = this.getChannel(params.channel)
    channel.description = params.description
  }

  @action.bound
  private handleOpList(params: ServerCommands["COL"]) {
    const channel = this.getChannel(params.channel)
    channel.ops = new Map(params.oplist.map((name): [string, true] => [name, true]))
  }

  @action.bound
  private handleNormalMessage(params: ServerCommands["MSG"]) {
    this.addChannelMessage(params.channel, {
      sender: params.character,
      text: params.message,
      type: "normal",
    })
  }

  @action.bound
  private handleAdMessage(params: ServerCommands["LRP"]) {
    this.addChannelMessage(params.channel, {
      sender: params.character,
      text: params.message,
      type: "ad",
    })
  }
}
