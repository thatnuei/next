import { ChannelStore } from "../channel/ChannelStore"
import { ChannelListStore } from "../channelList/ChannelListStore"
import { CharacterStore } from "../character/CharacterStore"
import { ChatStore } from "../chat/ChatStore"
import { ConversationStore } from "../conversation/ConversationStore"
import { ServerCommands } from "../fchat/types"
import { NavigationStore } from "../navigation/NavigationStore"
import { PrivateChatStore } from "../privateChat/PrivateChatStore"
import { SocketStore } from "../socket/SocketStore"
import { EventBus } from "../state/EventBus"
import { UserStore } from "../user/UserStore"
import { AppRouterStore } from "./AppRouterStore"

export type SocketEventBus = EventBus<ServerCommands>

export class AppStore {
  socketEvents: SocketEventBus = new EventBus()

  userStore = new UserStore()
  appRouterStore = new AppRouterStore()
  chatStore = new ChatStore(this, this.socketEvents)
  channelStore = new ChannelStore(this)
  channelListStore = new ChannelListStore(this)
  characterStore = new CharacterStore(this)
  privateChatStore = new PrivateChatStore(this)
  conversationStore = new ConversationStore(this)
  navigationStore = new NavigationStore()
  socketStore = new SocketStore(this)

  async init() {
    try {
      await this.userStore.loadCharacters()
      this.appRouterStore.setRoute("characterSelect")
    } catch (error) {
      console.warn("non-fatal:", error)
      this.appRouterStore.setRoute("login")
    }
  }
}
