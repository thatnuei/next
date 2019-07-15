import { action, computed, observable } from "mobx"
import { newMessageSound } from "../audio/sounds"
import { PrivateChatTab } from "../chat/ChatNavigationStore"
import { createCommandHandler } from "../fchat/helpers"
import MessageModel from "../message/MessageModel"
import RootStore from "../RootStore"
import FactoryMap from "../state/FactoryMap"
import { PrivateChatModel } from "./PrivateChatModel"

export default class PrivateChatStore {
  privateChats = new FactoryMap((name) => new PrivateChatModel(name))

  @observable.shallow
  chatPartnerNames = new Set<string>()

  constructor(private root: RootStore) {
    root.socketHandler.listen("command", this.handleSocketCommand)
  }

  @computed
  get chats() {
    return [...this.chatPartnerNames].map(this.privateChats.get)
  }

  sendMessage = (recipient: string, message: string) => {
    this.root.socketHandler.send("PRI", { recipient, message })

    this.privateChats
      .get(recipient)
      .messages.push(
        new MessageModel(this.root.chatStore.identity, message, "chat"),
      )
  }

  @action
  handleSocketCommand = createCommandHandler({
    PRI: (params) => {
      const privateChat = this.privateChats.get(params.character)

      const message = new MessageModel(params.character, params.message, "chat")
      privateChat.addMessage(message)

      const tab: PrivateChatTab = {
        type: "privateChat",
        partnerName: params.character,
      }
      this.root.chatNavigationStore.addTab(tab)

      const isPrivateChatActive = this.root.chatNavigationStore.isActive(tab)
      if (!isPrivateChatActive) {
        newMessageSound.play()
        privateChat.markUnread()
      }
    },

    TPN: (params) => {
      const privateChat = this.privateChats.get(params.character)
      privateChat.partnerTypingStatus = params.status
    },
  })
}
