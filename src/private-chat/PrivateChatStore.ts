import * as idb from "idb-keyval"
import { action, computed, observable, runInAction } from "mobx"
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
  openChat = (name: string) => {
    this.chatPartnerNames.add(name)
    this.saveChats()
  }

  @action
  closeChat = (name: string) => {
    this.chatPartnerNames.delete(name)
    this.saveChats()
  }

  @computed
  get chats() {
    return [...this.chatPartnerNames].map(this.privateChats.get)
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
      privateChat.messages.push(message)
      this.openChat(params.character)
    },

    TPN: (params) => {
      const privateChat = this.privateChats.get(params.character)
      privateChat.partnerTypingStatus = params.status
    },
  })
}
