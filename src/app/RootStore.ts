import { ChannelStore } from "../channel/ChannelStore"
import { ChannelListStore } from "../channelList/ChannelListStore"
import { CharacterStore } from "../character/CharacterStore"
import { ChatStore } from "../chat/ChatStore"
import { ConversationStore } from "../conversation/ConversationStore"
import { NavigationStore } from "../navigation/NavigationStore"
import { PrivateChatStore } from "../privateChat/PrivateChatStore"
import { SessionStore } from "../session/SessionStore"
import { SocketStore } from "../socket/SocketStore"

export class RootStore {
  socketStore = new SocketStore()
  chatStore = new ChatStore(this)
  channelStore = new ChannelStore(this)
  channelListStore = new ChannelListStore(this)
  characterStore = new CharacterStore(this)
  privateChatStore = new PrivateChatStore(this)
  conversationStore = new ConversationStore(this)
  navigationStore = new NavigationStore()
  sessionStore = new SessionStore(this)
}

export const rootStore = new RootStore()
