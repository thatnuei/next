import { action, computed, observable } from "mobx"
import CharacterCollection from "../character/CharacterCollection"
import { CharacterStatus } from "../character/types"
import { createCommandHandler } from "../fchat/helpers"
import { LoginResponse } from "../flist/FListApiService"
import RootStore from "../RootStore"
import { Friendship } from "./types"

const lastCharacterKey = (account: string) => `${account}:lastCharacter`

export default class ChatStore {
  @observable identity = ""
  @observable.ref characters: string[] = []
  @observable.ref friendships: Friendship[] = []
  bookmarks = new CharacterCollection(this.root.characterStore)
  admins = new CharacterCollection(this.root.characterStore)
  ignored = new CharacterCollection(this.root.characterStore)

  constructor(private root: RootStore) {
    root.socketHandler.listen("command", this.handleSocketCommand)
  }

  async submitLogin(account: string, password: string) {
    const response = await this.root.api.authenticate(account, password)
    this.handleLoginResponse(response)
  }

  @action
  private handleLoginResponse(response: LoginResponse) {
    this.characters = response.characters
    this.bookmarks.set(response.bookmarks.map(({ name }) => name))
    this.friendships = response.friends.map((entry) => ({
      us: entry.dest_name,
      them: entry.source_name,
    }))
  }

  @action
  setIdentity = (identity: string) => {
    this.identity = identity
    this.root.storage.set(lastCharacterKey(this.root.api.account), identity)
  }

  restoreIdentity = async () => {
    const key = lastCharacterKey(this.root.api.account)
    const storedIdentity = await this.root.storage.get<string>(key)
    this.setIdentity(storedIdentity || this.characters[0])
  }

  isFriend = (name: string) =>
    this.friendships.some((entry) => entry.them === name)

  isAdmin = (name: string) => this.admins.has(name)

  isIgnored = (name: string) => this.ignored.has(name)

  updateStatus = (status: CharacterStatus, statusmsg: string) => {
    this.root.socketHandler.send("STA", { status, statusmsg })
  }

  @computed
  get identityCharacter() {
    return this.root.characterStore.characters.get(this.identity)
  }

  @computed
  get friends() {
    const collection = new CharacterCollection(this.root.characterStore)
    collection.set(this.friendships.map((f) => f.them))
    return collection
  }

  @action
  handleSocketCommand = createCommandHandler({
    IDN: () => {
      // join some test channels
      this.root.socketHandler.send("JCH", { channel: "Frontpage" })
      this.root.socketHandler.send("JCH", { channel: "Fantasy" })
      this.root.socketHandler.send("JCH", { channel: "Femboy" })
      this.root.socketHandler.send("JCH", { channel: "Story Driven LFRP" })
      this.root.socketHandler.send("JCH", { channel: "Development" })
    },
    HLO: ({ message }) => {
      console.info(message)
    },
    CON: ({ count }) => {
      console.info(`There are ${count} characters in chat`)
    },
    PIN: () => {
      this.root.socketHandler.send("PIN", undefined)
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
