import { action, computed, observable } from "mobx"
import { AppStore } from "../app/AppStore"
import { ServerCommands } from "../fchat/types"
import { MessageModel, MessageModelOptions } from "../message/MessageModel"
import { ChannelModel } from "./ChannelModel"

export class ChannelStore {
  @observable
  channels = new Map<string, ChannelModel>()

  private joinedChannelIds = observable.map<string, true>()

  constructor(private root: AppStore) {
    root.socketEvents.listen("JCH", this.handleJoin)
    root.socketEvents.listen("LCH", this.handleLeave)
    root.socketEvents.listen("ICH", this.handleInitialChannelInfo)
    root.socketEvents.listen("CDS", this.handleChannelDescription)
    root.socketEvents.listen("COL", this.handleOpList)
    root.socketEvents.listen("MSG", this.handleNormalMessage)
    root.socketEvents.listen("LRP", this.handleAdMessage)
    root.socketEvents.listen("FLN", this.handleLogout)
    root.socketEvents.listen("IDN", this.restoreJoinedChannels)
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
    this.root.sendCommand("JCH", { channel: id })
  }

  leaveChannel(id: string) {
    this.root.sendCommand("LCH", { channel: id })
  }

  isJoined(id: string) {
    return this.joinedChannelIds.has(id)
  }

  sendMessage(id: string, message: string) {
    this.root.sendCommand("MSG", { channel: id, message })

    this.addChannelMessage(id, {
      sender: this.root.chatStore.identity,
      text: message,
      type: "normal",
    })
  }

  private get storedChannelsKey() {
    return `joinedChannels:${this.root.chatStore.identity}`
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

    if (params.character.identity === this.root.chatStore.identity) {
      this.joinedChannelIds.set(params.channel, true)
      this.saveJoinedChannels()
    }
  }

  @action.bound
  private handleLeave(params: ServerCommands["LCH"]) {
    const channel = this.getChannel(params.channel)
    channel.removeUser(params.character)

    if (params.character === this.root.chatStore.identity) {
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
