import { action, computed, observable } from "mobx"
import { AppStore } from "../app/AppStore"
import { MessageModel } from "../message/MessageModel"
import { CommandListener } from "../socket/SocketStore"
import { PrivateChatModel } from "./PrivateChatModel"

export class PrivateChatStore {
  @observable
  privateChats = new Map<string, PrivateChatModel>()

  private openChatPartners = observable.map<string, true>()

  constructor(private appStore: AppStore) {
    appStore.socketEvents.listen("IDN", this.restoreChats)
    appStore.socketEvents.listen("PRI", this.handleMessage)
    appStore.socketEvents.listen("TPN", this.handleTypingStatus)
  }

  @action.bound
  getPrivateChat(partner: string) {
    const privateChat = this.privateChats.get(partner)
    if (privateChat) return privateChat

    const newPrivateChat = new PrivateChatModel(partner)
    this.privateChats.set(partner, newPrivateChat)
    return newPrivateChat
  }

  @computed
  get openChats() {
    return [...this.openChatPartners.keys()].map(this.getPrivateChat)
  }

  @action
  closeChat(partner: string) {
    this.openChatPartners.delete(partner)
    this.saveChats()
  }

  sendMessage(recipientName: string, message: string) {
    this.appStore.sendCommand("PRI", { recipient: recipientName, message })

    const newMessage = new MessageModel({
      sender: this.appStore.identity,
      text: message,
      type: "normal",
    })

    this.getPrivateChat(recipientName).messages.push(newMessage)
  }

  private get storageKey() {
    return `privateChats:${this.appStore.identity}`
  }

  private saveChats() {
    const partners = [...this.openChatPartners.keys()]
    localStorage.setItem(this.storageKey, JSON.stringify(partners))
  }

  @action.bound
  private restoreChats() {
    let partners: string[] = []
    try {
      partners = JSON.parse(localStorage.getItem(this.storageKey) || "[]")
    } catch (error) {
      console.warn("Couldn't load private chats from storage:", error)
    }

    for (const name of partners) {
      this.openChatPartners.set(name, true)
    }
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
    this.openChatPartners.set(params.character, true)
    this.saveChats()
  }

  @action
  private handleTypingStatus: CommandListener<"TPN"> = (params) => {
    const privateChat = this.getPrivateChat(params.character)
    privateChat.partnerTypingStatus = params.status
  }
}
