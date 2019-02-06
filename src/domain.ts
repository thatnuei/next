import * as idb from "idb-keyval"
import { action, computed, observable } from "mobx"
import { ChannelMode } from "./channel/types"
import { CharacterStatus, Gender } from "./character/types"
import createUniqueId from "./common/createUniqueId"
import { chatServerUrl } from "./fchat/constants"
import createCommandHandler from "./fchat/createCommandHandler"
import { parseCommand } from "./fchat/helpers"
import { ClientCommandMap } from "./fchat/types"
import { authenticate, fetchCharacters } from "./flist/api"
import { MessageType } from "./message/types"
import FactoryMap from "./state/FactoryMap"

class RootStore {
  socketStore = new SocketStore(this)
  viewStore = new ViewStore(this)
  userStore = new UserStore()
  characterStore = new CharacterStore()
  channelStore = new ChannelStore(this)
  chatStore = new ChatStore(this)
}

const credentialsKey = "credentials"

class CharacterCollection {
  @observable.shallow private nameSet = new Set<string>()

  constructor(private characterStore: CharacterStore) {}

  @action
  set(names: Iterable<string>) {
    this.nameSet = new Set(names)
  }

  @action
  add(name: string) {
    this.nameSet.add(name)
  }

  @action
  remove(name: string) {
    this.nameSet.delete(name)
  }

  has(name: string) {
    return this.nameSet.has(name)
  }

  @computed
  get names() {
    return [...this.nameSet]
  }

  @computed
  get characters() {
    return [...this.nameSet].map((name) =>
      this.characterStore.characters.get(name),
    )
  }
}

class ChatStore {
  @observable identity = ""

  friends = new CharacterCollection(this.root.characterStore)
  ignoreds = new CharacterCollection(this.root.characterStore)
  admins = new CharacterCollection(this.root.characterStore)

  constructor(private root: RootStore) {}

  @action
  setIdentity(identity: string) {
    this.identity = identity
  }
}

class UserStore {
  account = ""
  ticket = ""
  @observable.ref characters: string[] = []

  @action
  setUserData(account: string, ticket: string, characters: string[]) {
    this.account = account
    this.ticket = ticket
    this.characters = characters
  }

  async restoreUserData() {
    const creds = await idb.get<
      { account: string; ticket: string } | undefined
    >(credentialsKey)

    if (!creds) {
      throw new Error("Auth credentials not found in storage")
    }

    const { account, ticket } = creds
    const { characters } = await fetchCharacters(account, ticket)
    this.setUserData(account, ticket, characters)
  }

  async submitLogin(account: string, password: string) {
    const { ticket, characters } = await authenticate(account, password)
    this.setUserData(account, ticket, characters)
    idb.set(credentialsKey, { account, ticket })
  }
}

type Screen =
  | "login"
  | "characterSelect"
  | "console"
  | "channel"
  | "privateChat"

class ViewStore {
  @observable screen: Screen = "login"
  @observable currentChannelId = ""
  @observable currentPrivateChatName = ""

  constructor(private root: RootStore) {}

  @action
  showLogin() {
    this.screen = "login"
  }

  @action
  showCharacterSelect() {
    this.screen = "characterSelect"
  }

  @action
  showConsole() {
    this.screen = "console"
  }

  @action
  showChannel(channelId: string) {
    this.screen = "channel"
    this.currentChannelId = channelId
  }

  @action
  showPrivateChat(name: string) {
    this.screen = "privateChat"
    this.currentPrivateChatName = name
  }

  @computed
  get currentChannel() {
    return this.root.channelStore.channels.get(this.currentChannelId)
  }

  @computed
  get currentPrivateChat(): never {
    throw new Error("TODO")
  }
}

class SocketStore {
  private socket?: WebSocket

  constructor(private root: RootStore) {}

  connectToChat() {
    const { account, ticket } = this.root.userStore
    const { identity } = this.root.chatStore

    const socket = (this.socket = new WebSocket(chatServerUrl))

    socket.onopen = () => {
      this.sendSocketCommand("IDN", {
        account,
        ticket,
        character: identity,
        cname: "next",
        cversion: "0.1.0",
        method: "ticket",
      })
    }

    socket.onclose = () => {}

    socket.onmessage = ({ data }) => {
      const command = parseCommand(data)
      this.handleSocketCommand(command)
      this.root.characterStore.handleSocketCommand(command)
      this.root.channelStore.handleSocketCommand(command)
    }
  }

  sendSocketCommand<K extends keyof ClientCommandMap>(
    cmd: K,
    params: ClientCommandMap[K],
  ) {
    if (this.socket) {
      if (params) {
        this.socket.send(`${cmd} ${JSON.stringify(params)}`)
      } else {
        this.socket.send(cmd)
      }
    }
  }

  @action
  private handleSocketCommand = createCommandHandler({
    IDN: () => {
      // join some test channels
      this.sendSocketCommand("JCH", { channel: "Frontpage" })
      this.sendSocketCommand("JCH", { channel: "Fantasy" })
      this.sendSocketCommand("JCH", { channel: "Story Driven LFRP" })
      this.sendSocketCommand("JCH", { channel: "Development" })
    },
    HLO: ({ message }) => {
      console.info(message)
    },
    CON: ({ count }) => {
      console.info(`There are ${count} characters in chat`)
    },
    PIN: () => {
      this.sendSocketCommand("PIN", undefined)
    },
  })
}

class CharacterModel {
  name: string
  @observable gender: Gender
  @observable status: CharacterStatus
  @observable statusMessage: string

  constructor(
    name: string,
    gender: Gender = "None",
    status: CharacterStatus = "offline",
    statusMessage = "",
  ) {
    this.name = name
    this.gender = gender
    this.status = status
    this.statusMessage = statusMessage
  }

  @action
  setGender(gender: Gender) {
    this.gender = gender
  }

  @action
  setStatus(status: CharacterStatus, statusMessage = "") {
    this.status = status
    this.statusMessage = statusMessage
  }
}

class CharacterStore {
  characters = new FactoryMap((name) => new CharacterModel(name))

  @action
  handleSocketCommand = createCommandHandler({
    LIS: ({ characters: characterInfoTuples }) => {
      for (const [name, gender, status, statusMessage] of characterInfoTuples) {
        const char = this.characters.get(name)
        char.setGender(gender)
        char.setStatus(status, statusMessage)
      }
    },

    NLN: ({ gender, identity }) => {
      const char = this.characters.get(identity)
      char.setGender(gender)
      char.setStatus("online")
    },

    FLN: ({ character: identity }) => {
      const char = this.characters.get(identity)
      char.setStatus("offline")
    },

    STA: ({ character: identity, status, statusmsg }) => {
      const char = this.characters.get(identity)
      char.setStatus(status, statusmsg)
    },
  })
}

class ChannelModel {
  @observable name = this.id
  @observable description = ""
  @observable mode: ChannelMode = "both"
  @observable selectedMode: ChannelMode = "both"
  @observable.shallow users = new CharacterCollection(this.characterStore)
  @observable.shallow ops = new CharacterCollection(this.characterStore)
  @observable.shallow messages: MessageModel[] = []

  constructor(private characterStore: CharacterStore, public id: string) {}

  @action
  setName(name: string) {
    this.name = name
  }

  @action
  setDescription(description: string) {
    this.description = description
  }

  @action
  setMode(mode: ChannelMode) {
    this.mode = mode
  }

  @action
  setSelectedMode(selectedMode: ChannelMode) {
    this.selectedMode = selectedMode
  }

  @action
  addMessage(message: MessageModel) {
    this.messages.push(message)
  }
}

class MessageModel {
  readonly id = createUniqueId()
  readonly time = Date.now()

  constructor(
    public readonly senderName: string | undefined, // if there is no sender, it is a system message
    public readonly text: string,
    public readonly type: MessageType,
  ) {}
}

type ChannelListing = {
  id: string
  name: string
  userCount: number
  mode?: ChannelMode
}

class ChannelStore {
  channels = new FactoryMap(
    (id) => new ChannelModel(this.root.characterStore, id),
  )

  @observable.ref publicChannelListings: ChannelListing[] = []
  @observable.ref privateChannelListings: ChannelListing[] = []

  constructor(private root: RootStore) {}

  @computed
  get joinedChannels() {
    return this.channels.values.filter((channel) =>
      channel.users.has(this.root.chatStore.identity),
    )
  }

  requestListings() {
    this.root.socketStore.sendSocketCommand("CHA", undefined)
    this.root.socketStore.sendSocketCommand("ORS", undefined)
  }

  join(channelId: string) {
    this.root.socketStore.sendSocketCommand("JCH", { channel: channelId })
  }

  leave(channelId: string) {
    this.root.socketStore.sendSocketCommand("LCH", { channel: channelId })
  }

  isJoined(channelId: string) {
    return this.joinedChannels.some((channel) => channel.id === channelId)
  }

  @action
  handleSocketCommand = createCommandHandler({
    ICH: ({ channel: id, mode, users }) => {
      const channel = this.channels.get(id)
      channel.users.set(users.map(({ identity }) => identity))
      channel.setMode(mode)
    },

    CDS: ({ channel: id, description }) => {
      this.channels.update(id, (channel) => {
        channel.description = description
      })
    },

    COL: ({ channel: id, oplist }) => {
      const channel = this.channels.get(id)
      channel.ops.set(oplist)
    },

    JCH: ({ channel: id, character, title }) => {
      const channel = this.channels.get(id)
      channel.setName(title)
      channel.users.add(character.identity)
    },

    LCH: ({ channel: id, character }) => {
      const channel = this.channels.get(id)
      channel.users.remove(character)
    },

    FLN: ({ character }) => {
      for (const channel of this.channels.values) {
        channel.users.remove(character)
      }
    },

    MSG: ({ channel: id, character, message }) => {
      const channel = this.channels.get(id)
      channel.addMessage(new MessageModel(character, message, "chat"))
    },

    LRP: ({ channel: id, character, message }) => {
      const channel = this.channels.get(id)
      channel.addMessage(new MessageModel(character, message, "lfrp"))
    },

    CHA: ({ channels }) => {
      this.publicChannelListings = channels.map(
        ({ name, mode, characters }): ChannelListing => ({
          id: name,
          name,
          mode,
          userCount: characters,
        }),
      )
    },

    ORS: ({ channels }) => {
      this.publicChannelListings = channels.map(
        ({ name, title, characters }): ChannelListing => ({
          id: name,
          name: title,
          userCount: characters,
        }),
      )
    },
  })
}
