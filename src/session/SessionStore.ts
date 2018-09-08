import { computed } from "mobx"
import { AppViewStore } from "../app/AppViewStore"
import { ChannelStore } from "../channel/ChannelStore"
import { CharacterStore } from "../character/CharacterStore"
import { ChatStore } from "../chat/ChatStore"
import { ConversationStore } from "../conversation/ConversationStore"
import { fetchCharacters, fetchTicket } from "../flist/api"
import { PrivateChatStore } from "../privateChat/PrivateChatStore"
import { SocketStore } from "../socket/SocketStore"
import { UserStore } from "../user/UserStore"
import { loadAuthData, saveAuthData } from "./storage"

export class SessionStore {
  appViewStore = new AppViewStore()
  user = new UserStore()
  connection = new SocketStore()
  chat = new ChatStore(this.connection)
  characters = new CharacterStore(this.connection)
  channels = new ChannelStore(this.connection, this.chat)
  privateChatStore = new PrivateChatStore(this.connection)
  conversationStore = new ConversationStore(this.channels, this.privateChatStore)

  constructor() {
    this.connection.addCommandListener("IDN", () => {
      this.appViewStore.setScreen("chat")

      this.connection.sendCommand("JCH", { channel: "Frontpage" })
      this.connection.sendCommand("JCH", { channel: "Fantasy" })
      this.connection.sendCommand("JCH", { channel: "Story Driven LFRP" })
    })

    this.connection.addDisconnectListener(() => {
      alert("Disconnected from server :(")
      this.appViewStore.setScreen("login")
    })
  }

  async getApiTicket(account: string, password: string) {
    const { ticket, characters } = await fetchTicket(account, password)
    this.user.setUserData(account, ticket, characters)
  }

  async restoreUserData() {
    const { account, ticket } = loadAuthData()
    if (!account || !ticket) {
      throw new Error("Account or ticket not found in storage")
    }

    const { characters } = await fetchCharacters(account, ticket)
    this.user.setUserData(account, ticket, characters)
  }

  saveUserData() {
    saveAuthData(this.user.account, this.user.ticket)
  }

  @computed
  get identityCharacter() {
    return this.characters.getCharacter(this.chat.identity)
  }
}
