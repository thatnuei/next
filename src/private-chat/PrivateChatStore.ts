import * as idb from "idb-keyval"
import { action, computed, observable, runInAction } from "mobx"
import { newMessageSound } from "../audio/sounds"
import { createCommandHandler } from "../fchat/helpers"
import MessageModel from "../message/MessageModel"
import RootStore from "../RootStore"
import FactoryMap from "../state/FactoryMap"
import { PrivateChatModel } from "./PrivateChatModel"

type StoredPrivateChat = { name: string }

export default class PrivateChatStore {
  privateChats = new FactoryMap((name) => new PrivateChatModel(name))

  @observable.shallow
  chatPartnerNames = new Set<string>()

  constructor(private root: RootStore) {
    root.socketHandler.listen("command", this.handleSocketCommand)
  }

  @action
  createChat = (name: string) => {
    this.chatPartnerNames.add(name)
    this.saveChats()
  }

  @action
  removeChat = (name: string) => {
    this.chatPartnerNames.delete(name)
    this.saveChats()
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

  private saveChats = async () => {
    const data: StoredPrivateChat[] = [...this.chatPartnerNames].map(
      (name) => ({
        name,
      }),
    )

    await idb.set(this.storageKey, data)
  }

  private restoreChats = async () => {
    const loadedData =
      (await idb.get<StoredPrivateChat[]>(this.storageKey)) || []

    const names = loadedData.map((entry) => entry.name)

    runInAction("setRestoredPrivateChats", () => {
      this.chatPartnerNames = new Set(names)
    })
  }

  private get storageKey() {
    return `privateChats:${this.root.chatStore.identity}`
  }

  @action
  handleSocketCommand = createCommandHandler({
    IDN: () => {
      this.restoreChats()
    },

    PRI: (params) => {
      const privateChat = this.privateChats.get(params.character)

      const message = new MessageModel(params.character, params.message, "chat")
      privateChat.addMessage(message)

      this.createChat(params.character)

      if (!this.root.viewStore.isPrivateChatActive(params.character)) {
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
