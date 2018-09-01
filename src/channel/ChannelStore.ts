import { action, observable } from "mobx"
import { ChatState } from "../chat/ChatState"
import { CommandListener, SocketConnectionHandler } from "../fchat/SocketConnectionHandler"
import { MessageModel, MessageModelOptions } from "../message/MessageModel"
import { ChannelModel } from "./ChannelModel"

export class ChannelStore {
  @observable
  channels = new Map<string, ChannelModel>()

  @observable
  joinedChannels = new Set<string>()

  constructor(connection: SocketConnectionHandler, private chatState: ChatState) {
    connection.addCommandListener("JCH", this.handleJoin)
    connection.addCommandListener("LCH", this.handleLeave)
    connection.addCommandListener("ICH", this.handleInitialChannelInfo)
    connection.addCommandListener("CDS", this.handleChannelDescription)
    connection.addCommandListener("COL", this.handleOpList)
    connection.addCommandListener("MSG", this.handleNormalMessage)
    connection.addCommandListener("LRP", this.handleAdMessage)
  }

  @action
  getChannel(id: string) {
    const channel = this.channels.get(id) || new ChannelModel(id)
    this.channels.set(id, channel)
    return channel
  }

  @action
  private addChannelMessage = (channelId: string, options: MessageModelOptions) => {
    const channel = this.getChannel(channelId)
    const message = new MessageModel(options)
    channel.messages.push(message)

    while (channel.messages.length > 400) {
      channel.messages.shift()
    }
  }

  @action
  private handleJoin: CommandListener<"JCH"> = (params) => {
    const channel = this.getChannel(params.channel)
    channel.title = params.title
    channel.users.add(params.character.identity)

    if (params.character.identity === this.chatState.identity) {
      this.joinedChannels.add(params.character.identity)
    }
  }

  @action
  private handleLeave: CommandListener<"LCH"> = (params) => {
    const channel = this.getChannel(params.channel)
    channel.users.delete(params.character)

    if (params.character === this.chatState.identity) {
      this.joinedChannels.delete(params.character)
    }
  }

  @action
  private handleInitialChannelInfo: CommandListener<"ICH"> = (params) => {
    const channel = this.getChannel(params.channel)
    channel.users = new Set(params.users.map((user) => user.identity))
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
    channel.ops = new Set(params.oplist)
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
