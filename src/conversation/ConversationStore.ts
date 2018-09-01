import { action, computed, observable } from "mobx"
import { ChannelModel } from "../channel/ChannelModel"
import { ChannelStore } from "../channel/ChannelStore"

export type ConversationType = { type: "channel"; id: string; model: ChannelModel }

export class ConversationStore {
  @observable.ref
  activeConversation?: ConversationType

  constructor(private channelStore: ChannelStore) {}

  @computed
  get channelConversations() {
    return [...this.channelStore.channels.values()]
      .sort((a, b) => a.title.localeCompare(b.title))
      .map(
        (channel): ConversationType => ({
          type: "channel",
          id: `channel-${channel.id}`,
          model: channel,
        }),
      )
  }

  @computed
  get conversations(): ConversationType[] {
    return this.channelConversations
  }

  @action
  setActiveConversation(convo: ConversationType) {
    this.activeConversation = convo
  }

  isActive(convo: ConversationType) {
    const current = this.activeConversation
    return current && current.id === convo.id
  }
}
