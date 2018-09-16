import { action, computed, observable } from "mobx"
import { RootStore } from "../app/RootStore"
import { MessageModel, MessageModelOptions } from "../message/MessageModel"
import { CommandListener } from "../socket/SocketStore"
import { ChannelModel } from "./ChannelModel"

export class ChannelStore {
  @observable
  channels = new Map<string, ChannelModel>()

  private joinedChannelIds = observable.map<string, true>()

  constructor(private rootStore: RootStore) {
    const { socketStore } = rootStore
    socketStore.addCommandListener("JCH", this.handleJoin)
    socketStore.addCommandListener("LCH", this.handleLeave)
    socketStore.addCommandListener("ICH", this.handleInitialChannelInfo)
    socketStore.addCommandListener("CDS", this.handleChannelDescription)
    socketStore.addCommandListener("COL", this.handleOpList)
    socketStore.addCommandListener("MSG", this.handleNormalMessage)
    socketStore.addCommandListener("LRP", this.handleAdMessage)
    socketStore.addCommandListener("FLN", this.handleLogout)
    socketStore.addCommandListener("IDN", this.restoreJoinedChannels)
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
    this.rootStore.socketStore.sendCommand("JCH", { channel: id })
  }

  leaveChannel(id: string) {
    this.rootStore.socketStore.sendCommand("LCH", { channel: id })
  }

  isJoined(id: string) {
    return this.joinedChannelIds.has(id)
  }

  private get storedChannelsKey() {
    return `joinedChannels:${this.rootStore.chatStore.identity}`
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

  @action
  private handleJoin: CommandListener<"JCH"> = (params) => {
    const channel = this.getChannel(params.channel)
    channel.title = params.title
    channel.type = params.channel === params.title ? "public" : "private"
    channel.addUser(params.character.identity)

    if (params.character.identity === this.rootStore.chatStore.identity) {
      this.joinedChannelIds.set(params.channel, true)
      this.saveJoinedChannels()
    }
  }

  @action
  private handleLeave: CommandListener<"LCH"> = (params) => {
    const channel = this.getChannel(params.channel)
    channel.removeUser(params.character)

    if (params.character === this.rootStore.chatStore.identity) {
      this.joinedChannelIds.delete(params.channel)
      this.saveJoinedChannels()
    }
  }

  @action
  private handleLogout: CommandListener<"FLN"> = (params) => {
    for (const channel of this.channels.values()) {
      channel.removeUser(params.character)
    }
  }

  @action
  private handleInitialChannelInfo: CommandListener<"ICH"> = (params) => {
    const channel = this.getChannel(params.channel)
    channel.setUsers(params.users.map((user) => user.identity))
    channel.mode = params.mode
  }

  @action
  private handleChannelDescription: CommandListener<"CDS"> = (params) => {
    const channel = this.getChannel(params.channel)
    channel.description = params.description
  }

  @action
  private handleOpList: CommandListener<"COL"> = (params) => {
    const channel = this.getChannel(params.channel)
    channel.ops = new Map(params.oplist.map((name): [string, true] => [name, true]))
  }

  @action
  private handleNormalMessage: CommandListener<"MSG"> = (params) => {
    this.addChannelMessage(params.channel, {
      sender: params.character,
      text: params.message,
      type: "normal",
    })
  }

  @action
  private handleAdMessage: CommandListener<"LRP"> = (params) => {
    this.addChannelMessage(params.channel, {
      sender: params.character,
      text: params.message,
      type: "ad",
    })
  }
}
