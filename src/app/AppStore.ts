import { bind } from "decko"
import { ChannelStore } from "../channel/ChannelStore"
import { ChannelListStore } from "../channelList/ChannelListStore"
import { CharacterStore } from "../character/CharacterStore"
import { ChatStore } from "../chat/ChatStore"
import { ConversationStore } from "../conversation/ConversationStore"
import { ClientCommands, ServerCommands } from "../fchat/types"
import { NavigationStore } from "../navigation/NavigationStore"
import { PrivateChatStore } from "../privateChat/PrivateChatStore"
import { EventBus } from "../state/EventBus"
import { UserStore } from "../user/UserStore"
import { AppRouterStore } from "./AppRouterStore"

export type SocketEventBus = EventBus<ServerCommands>

export class AppStore {
  socket?: WebSocket
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

  async init() {
    try {
      await this.userStore.loadCharacters()
      this.appRouterStore.setRoute("characterSelect")
    } catch (error) {
      console.warn("non-fatal:", error)
      this.appRouterStore.setRoute("login")
    }
  }

  @bind
  connectToChat(account: string, ticket: string, character: string) {
    this.chatStore.setIdentity(character)
    this.appRouterStore.setRoute("connecting")

    const socket = (this.socket = new WebSocket(`wss://chat.f-list.net:9799`))

    socket.onopen = () => {
      this.sendCommand("IDN", {
        account,
        ticket,
        character,
        cname: "next",
        cversion: "0.1.0",
        method: "ticket",
      })
    }

    socket.onmessage = ({ data }: { data: string }) => {
      const command = data.slice(0, 3) as keyof ServerCommands
      const params = data.length > 3 ? JSON.parse(data.slice(4)) : {}

      if (command === "PIN") {
        this.sendCommand("PIN", undefined)
        return
      }

      if (command === "IDN") {
        this.appRouterStore.setRoute("chat")
      }

      this.socketEvents.send(command, params)

      console.log(command, params)
    }

    socket.onclose = () => {
      alert("Chat connection lost :(")
      this.init()
      // TODO: reconnect?
    }
  }

  sendCommand<K extends keyof ClientCommands>(command: K, params: ClientCommands[K]) {
    if (this.socket) {
      if (params) {
        this.socket.send(`${command} ${JSON.stringify(params)}`)
      } else {
        this.socket.send(command)
      }
    }
  }
}
