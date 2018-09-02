import { action, observable } from "mobx"
import { CommandListener, SocketConnectionHandler } from "../fchat/SocketConnectionHandler"
import { MessageModel } from "../message/MessageModel"
import { PrivateChatModel } from "./PrivateChatModel"

export class PrivateChatStore {
  @observable
  privateChats = new Map<string, PrivateChatModel>()

  constructor(connection: SocketConnectionHandler) {
    connection.addCommandListener("PRI", this.handleMessage)
    connection.addCommandListener("TPN", this.handleTypingStatus)
  }

  @action
  getPrivateChat(partner: string) {
    const privateChat = this.privateChats.get(partner)
    if (privateChat) return privateChat

    const newPrivateChat = new PrivateChatModel(partner)
    this.privateChats.set(partner, newPrivateChat)
    return newPrivateChat
  }

  @action
  private handleMessage: CommandListener<"PRI"> = (params) => {
    const privateChat = this.getPrivateChat(params.character)

    const newMessage = new MessageModel({
      sender: params.character,
      text: params.message,
      type: "normal",
    })

    privateChat.messages.push(newMessage)
  }

  @action
  private handleTypingStatus: CommandListener<"TPN"> = (params) => {
    const privateChat = this.getPrivateChat(params.character)
    privateChat.partnerTypingStatus = params.status
  }
}
