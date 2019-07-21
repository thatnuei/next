import * as idb from "idb-keyval"
import { isEqual } from "lodash"
import { action, observable, toJS } from "mobx"
import clamp from "../common/clamp"
import RootStore from "../RootStore"

export type ConsoleTab = { type: "console" }
export type ChannelTab = { type: "channel"; channelId: string }
export type PrivateChatTab = { type: "privateChat"; partnerName: string }

export type ChatTab = ConsoleTab | ChannelTab | PrivateChatTab

export default class ChatNavigationStore {
  @observable.shallow
  tabs: ChatTab[] = []

  @observable.ref
  activeTab?: ChatTab

  constructor(private root: RootStore) {
    root.socketHandler.listen("IDN", this.restoreTabs)
  }

  @action
  addTab = (tab: ChatTab) => {
    if (this.tabs.some((other) => isEqual(tab, other))) return
    this.tabs.push(tab)
    this.saveTabs()
  }

  @action
  removeTab = (tab: ChatTab) => {
    const index = this.tabs.findIndex((other) => isEqual(tab, other))
    if (index < 0) return

    // need to select a new tab if we're closing the active tab
    if (this.isActive(tab)) {
      const newIndex = clamp(index + 1, 0, this.tabs.length - 2) // -2 to account for the removed tab
      this.showTab(this.tabs[newIndex])
    }

    this.tabs.splice(index, 1)

    this.saveTabs()
  }

  @action
  showTab = (tab: ChatTab) => {
    const existing = this.tabs.find((other) => isEqual(other, tab))
    if (!existing) {
      this.addTab(tab)
      this.activeTab = tab
    } else {
      this.activeTab = existing
    }
  }

  isActive = (tab: ChatTab) => isEqual(this.activeTab, tab)

  hasTab = (tab: ChatTab) => this.tabs.some((other) => isEqual(tab, other))

  private get storageKey() {
    return `${this.root.chatStore.identity}:tabs`
  }

  private saveTabs = () => {
    idb.set(this.storageKey, toJS(this.tabs))
  }

  private restoreTabs = async () => {
    const tabs = await idb.get<ChatTab[] | undefined>(this.storageKey)
    if (tabs) {
      for (const tab of tabs) {
        if (tab.type === "channel") {
          this.root.channelStore.join(tab.channelId)
        }
        if (tab.type === "privateChat") {
          this.addTab(tab)
        }
      }
    }
  }
}
