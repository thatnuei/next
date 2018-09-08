import { action, computed, observable } from "mobx"
import { ChatStore } from "../chat/ChatStore"
import { MessageModel, MessageModelOptions } from "../message/MessageModel"
import { CommandListener, SocketStore } from "../socket/SocketStore"
import { ChannelModel } from "./ChannelModel"

export class ChannelStore {
  @observable
  channels = new Map<string, ChannelModel>()

  private joinedChannelIds = observable.map<string, true>()

  constructor(private connection: SocketStore, private chatStore: ChatStore) {
    connection.addCommandListener("JCH", this.handleJoin)
    connection.addCommandListener("LCH", this.handleLeave)
    connection.addCommandListener("ICH", this.handleInitialChannelInfo)
    connection.addCommandListener("CDS", this.handleChannelDescription)
    connection.addCommandListener("COL", this.handleOpList)
    connection.addCommandListener("MSG", this.handleNormalMessage)
    connection.addCommandListener("LRP", this.handleAdMessage)
    connection.addCommandListener("FLN", this.handleLogout)
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

  @action
  leaveChannel(channel: string) {
    this.connection.sendCommand("LCH", { channel })
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
    channel.addUser(params.character.identity)

    if (params.character.identity === this.chatStore.identity) {
      this.joinedChannelIds.set(params.channel, true)
    }
  }

  @action
  private handleLeave: CommandListener<"LCH"> = (params) => {
    const channel = this.getChannel(params.channel)
    channel.removeUser(params.character)

    if (params.character === this.chatStore.identity) {
      this.joinedChannelIds.delete(params.channel)
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
