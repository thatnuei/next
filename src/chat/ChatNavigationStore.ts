import { isEqual } from "lodash"
import { action, observable } from "mobx"
import clamp from "../common/clamp"

export type ConsoleTab = { type: "console" }
export type ChannelTab = { type: "channel"; channelId: string }
export type PrivateChatTab = { type: "privateChat"; partnerName: string }

export type ChatTab = ConsoleTab | ChannelTab | PrivateChatTab

export default class ChatNavigationStore {
  @observable.shallow
  tabs: ChatTab[] = [{ type: "console" }]

  @observable.ref
  activeTab = this.tabs[0]

  @action
  addTab = (tab: ChatTab) => {
    if (this.tabs.some((other) => isEqual(tab, other))) return
    this.tabs.push(tab)
  }

  @action
  removeTab = (tab: ChatTab) => {
    const index = this.tabs.findIndex((other) => isEqual(tab, other))
    if (index < 0) return

    const newIndex = clamp(index + 1, 0, this.tabs.length - 1)
    this.showTab(this.tabs[newIndex])

    this.tabs.splice(index, 1)
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
}
