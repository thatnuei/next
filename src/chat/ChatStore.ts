import { action, observable } from "mobx"
import RootStore from "../RootStore"
import StoredValue from "../storage/StoredValue"
import { createCommandHandler } from "./helpers"
import { ServerCommand } from "./types"

export type ChatRoom = ChannelRoom | PrivateChatRoom
type ChannelRoom = { type: "channel"; id: string }
type PrivateChatRoom = { type: "privateChat"; partnerName: string }

type ConnectionState = "offline" | "connecting" | "online"

export default class ChatStore {
  @observable
  identity = ""

  @observable
  connectionState: ConnectionState = "offline"

  @observable.ref
  currentRoom?: ChatRoom

  @observable
  updatingStatus = false

  constructor(private root: RootStore) {}

  get storedIdentity() {
    return new StoredValue<string>(`identity:${this.root.userStore.account}`)
  }

  get identityCharacter() {
    return this.root.characterStore.characters.get(this.identity)
  }

  get currentChannelId() {
    return this.currentRoom?.type === "channel"
      ? this.currentRoom.id
      : undefined
  }

  get isConnecting() {
    return this.connectionState === "connecting"
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
  setCurrentRoom = (room: ChatRoom) => {
    this.currentRoom = room
  }

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
  })
}
