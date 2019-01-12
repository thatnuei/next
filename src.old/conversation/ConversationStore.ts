import { action, computed, observable } from "mobx"
import { AppStore } from "../app/AppStore"
import { clamp } from "../helpers/math"
import { ConversationModel } from "./ConversationModel"

export class ConversationStore {
  // TODO: use id-based selection instead of index-based
  @observable.ref
  activeConversationIndex = 0

  constructor(private appStore: AppStore) {}

  @computed
  get channelConversations() {
    return this.appStore.channelStore.joinedChannels.sort((a, b) => a.title.localeCompare(b.title))
  }

  @computed
  get privateConversations() {
    return this.appStore.privateChatStore.openChats.sort((a, b) =>
      a.partner.localeCompare(b.partner),
    )
  }

  @computed
  get conversations(): ConversationModel[] {
    return [...this.channelConversations, ...this.privateConversations]
  }

  @computed
  get activeConversation(): ConversationModel | undefined {
    const index = clamp(this.activeConversationIndex, 0, this.conversations.length - 1)
    return this.conversations[index]
  }

  @action
  setActiveConversation(convo: ConversationModel) {
    const index = this.conversations.indexOf(convo)
    if (index > -1) {
      this.activeConversationIndex = index
    }
  }

  isActive(convo: ConversationModel) {
    const current = this.activeConversation
    return current !== undefined && current.id === convo.id
  }
}
