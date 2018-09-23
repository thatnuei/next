import { bind } from "decko"
import { action, computed, observable } from "mobx"
import { ChannelStore } from "../channel/ChannelStore"
import { ChannelListStore } from "../channelList/ChannelListStore"
import { CharacterStore } from "../character/CharacterStore"
import { CharacterStatus } from "../character/types"
import { ChatStore } from "../chat/ChatStore"
import { ConversationStore } from "../conversation/ConversationStore"
import { ClientCommands, ServerCommands } from "../fchat/types"
import { authenticate, fetchCharacters } from "../flist/api"
import { assertDefined } from "../helpers/assertDefined"
import { NavigationStore } from "../navigation/NavigationStore"
import { PrivateChatStore } from "../privateChat/PrivateChatStore"
import { EventBus } from "../state/EventBus"
import { AppRouterStore } from "./AppRouterStore"
import { LoginValues } from "./LoginScreen"

export type SocketEventBus = EventBus<ServerCommands>

export class AppStore {
  @observable
  account = ""

  @observable
  ticket = ""

  @observable
  characters: string[] = []

  @observable
  identity = ""

  socket?: WebSocket
  socketEvents: SocketEventBus = new EventBus()

  appRouterStore = new AppRouterStore()
  chatStore = new ChatStore(this.socketEvents)
  channelStore = new ChannelStore(this)
  channelListStore = new ChannelListStore(this)
  characterStore = new CharacterStore(this)
  privateChatStore = new PrivateChatStore(this)
  conversationStore = new ConversationStore(this)
  navigationStore = new NavigationStore()

  async init() {
    try {
      this.restoreAuthData()
      await this.fetchCharacters()
      this.restoreIdentity()
      this.appRouterStore.setRoute("characterSelect")
    } catch (error) {
      console.warn("non-fatal:", error)
      this.appRouterStore.setRoute("login")
    }
  }

  @bind
  async handleLoginSubmit({ account, password }: LoginValues) {
    try {
      const { ticket, characters } = await authenticate(account, password)
      this.setAuthData(account, ticket)
      this.setCharacters(characters)
      this.restoreIdentity()
      this.appRouterStore.setRoute("characterSelect")
      this.saveAuthData()
    } catch (error) {
      alert(error)
    }
  }

  @bind
  handleCharacterSubmit() {
    this.connectToChat()
  }

  @bind
  private connectToChat() {
    this.appRouterStore.setRoute("connecting")

    const socket = (this.socket = new WebSocket(`wss://chat.f-list.net:9799`))

    socket.onopen = () => {
      this.sendCommand("IDN", {
        account: this.account,
        ticket: this.ticket,
        character: this.identity,
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

  @action
  private setAuthData(account: string, ticket: string) {
    this.account = account
    this.ticket = ticket
  }

  @action
  private setCharacters(characters: string[]) {
    this.characters = characters
  }

  @action.bound
  setIdentity(identity: string) {
    this.identity = identity
    this.saveIdentity()
  }

  private async fetchCharacters() {
    const { characters } = await fetchCharacters(this.account, this.ticket)
    this.setCharacters(characters)
  }

  @action
  private restoreAuthData() {
    this.account = assertDefined(localStorage.getItem("account"), "Account not found")
    this.ticket = assertDefined(localStorage.getItem("ticket"), "Ticket not found")
  }

  private saveAuthData() {
    localStorage.setItem("account", this.account)
    localStorage.setItem("ticket", this.ticket)
  }

  private restoreIdentity() {
    this.identity = localStorage.getItem("lastCharacter") || this.characters[0]
  }

  private saveIdentity() {
    localStorage.setItem("lastCharacter", this.identity)
  }

  @computed
  get identityCharacter() {
    return this.characterStore.getCharacter(this.identity)
  }

  updateStatus(status: CharacterStatus, statusmsg: string) {
    this.sendCommand("STA", { status, statusmsg })
  }
}
