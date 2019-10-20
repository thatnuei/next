import { action, observable } from "mobx"
import CharacterCollection from "../character/CharacterCollection"
import { LoginResponse } from "../flist/FListApi"
import RootStore from "../RootStore"
import StoredValue from "../storage/StoredValue"
import { createCommandHandler } from "./helpers"
import { Friendship, ServerCommand } from "./types"

type ConnectionState = "offline" | "connecting" | "online"

export default class ChatStore {
  @observable
  identity = ""

  @observable
  connectionState: ConnectionState = "offline"

  @observable.ref friendships: Friendship[] = []
  bookmarks = new CharacterCollection(this.root.characterStore)
  admins = new CharacterCollection(this.root.characterStore)
  ignored = new CharacterCollection(this.root.characterStore)

  constructor(private root: RootStore) {}

  get storedIdentity() {
    return new StoredValue<string>(`identity:${this.root.userStore.account}`)
  }

  get identityCharacter() {
    return this.root.characterStore.characters.get(this.identity)
  }

  get isConnecting() {
    return this.connectionState === "connecting"
  }

  showPrimaryNavigation = () => {
    this.root.overlayStore.open({
      type: "primaryNavigation",
    })
  }

  @action
  setIdentity = (identity: string) => {
    this.identity = identity
    this.storedIdentity.set(identity)
  }

  restoreIdentity = async () => {
    const identity = await this.storedIdentity.get()
    if (identity) this.setIdentity(identity)
  }

  @action
  setRelationsFromLoginResponse = (response: LoginResponse) => {
    this.bookmarks.set(response.bookmarks.map(({ name }) => name))

    this.friendships = response.friends.map((entry) => ({
      us: entry.dest_name,
      them: entry.source_name,
    }))
  }

  isFriend = (name: string) => this.friendships.find((f) => f.them === name)
  isBookmark = (name: string) => this.bookmarks.has(name)
  isAdmin = (name: string) => this.admins.has(name)
  isIgnored = (name: string) => this.ignored.has(name)

  @action
  connectToChat = () => {
    const { account, ticket } = this.root.userStore

    this.root.socketStore.connect(account, ticket, this.identity)
    this.connectionState = "connecting"
  }

  addSocketListeners = () => {
    const { events } = this.root.socketStore

    events.listen("close", this.handleSocketClose)
    events.listen("error", this.handleSocketError)
    events.listen("command", this.handleSocketCommand)
  }

  @action
  handleSocketClose = () => {
    this.connectionState = "offline"
    this.root.appStore.showLogin()
  }

  @action
  handleSocketError = () => {
    this.connectionState = "offline"
    this.root.appStore.showLogin()
  }

  @action
  handleSocketCommand = (command: ServerCommand) => {
    const handlers = [
      this.handleChatCommand,
      this.root.characterStore.handleSocketCommand,
      this.root.channelStore.handleSocketCommand,
      this.root.channelBrowserStore.handleSocketCommand,
      this.root.privateChatStore.handleSocketCommand,
    ]
    handlers.forEach((handle) => handle(command))
  }

  @action
  handleChatCommand = createCommandHandler({
    IDN: () => {
      this.connectionState = "online"
      this.root.appStore.showChat()

      this.root.channelStore.join("Frontpage")
      this.root.channelStore.join("Fantasy")
      this.root.channelStore.join("Development")
      this.root.channelStore.join("Story Driven LFRP")
    },

    HLO: ({ message }) => {
      console.info(message)
    },
    CON: ({ count }) => {
      console.info(`There are ${count} characters in chat`)
    },

    ADL: ({ ops }) => {
      this.admins.set(ops)
    },

    IGN: (params) => {
      switch (params.action) {
        case "init":
        case "list":
          this.ignored.set(params.characters)
          break

        case "add":
          this.ignored.add(params.character)
          break

        case "delete":
          this.ignored.remove(params.character)
          break
      }
    },

    RTB: (params) => {
      switch (params.type) {
        case "friendadd":
        case "friendremove":
          // refetch friends from API?
          break

        case "trackadd":
          this.bookmarks.add(params.name)
          break

        case "trackrem":
          this.bookmarks.remove(params.name)
          break
      }
    },
  })
}
