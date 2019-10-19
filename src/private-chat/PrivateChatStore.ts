import { action, computed, observable } from "mobx"
import { newMessageSound } from "../audio/sounds"
import { createCommandHandler } from "../chat/helpers"
import { TypingStatus } from "../chat/types"
import MessageModel from "../message/MessageModel"
import RootStore from "../RootStore"
import FactoryMap from "../state/classes/FactoryMap"
import { PrivateChatModel } from "./PrivateChatModel"

export default class PrivateChatStore {
  privateChats = new FactoryMap((name) => new PrivateChatModel(name))

  @observable.shallow
  chatPartnerNames = new Set<string>()

  constructor(private root: RootStore) {}

  @computed
  get openChats(): PrivateChatModel[] {
    return [...this.chatPartnerNames.values()].map(this.privateChats.get)
  }

  @action
  openChat = (partnerName: string) => {
    this.chatPartnerNames.add(partnerName)
  }

  @action
  closeChat = (partnerName: string) => {
    this.chatPartnerNames.delete(partnerName)
  }

  sendMessage = (recipient: string, message: string) => {
    this.root.socketStore.sendCommand("PRI", { recipient, message })

    const chat = this.privateChats.get(recipient)
    chat.messages.push(
      new MessageModel(this.root.chatStore.identity, message, "chat"),
    )
  }

  updateTypingStatus = (partnerName: string, status: TypingStatus) => {
    this.root.socketStore.sendCommand("TPN", { character: partnerName, status })
  }

  sendRoll = (partnerName: string, dice: string) => {
    this.root.socketStore.sendCommand("RLL", { recipient: partnerName, dice })
  }

  @action
  handleSocketCommand = createCommandHandler({
    PRI: (params) => {
      this.chatPartnerNames.add(params.character)

      const privateChat = this.privateChats.get(params.character)

      const message = new MessageModel(params.character, params.message, "chat")
      privateChat.addMessage(message)

      const isCurrent = this.root.chatNavigationStore.isCurrentPrivateChat(
        params.character,
      )
      if (!isCurrent || document.hidden) {
        newMessageSound.play()
        privateChat.markUnread()
      }
    },

    RLL: (params) => {
      if ("recipient" in params) {
        const chat = this.privateChats.get(params.recipient)
        const message = new MessageModel(undefined, params.message, "system")
        chat.addMessage(message)
      }
    },

    TPN: (params) => {
      const privateChat = this.privateChats.get(params.character)
      privateChat.partnerTypingStatus = params.status
    },
  })
}
