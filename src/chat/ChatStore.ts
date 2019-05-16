import { action, computed, observable } from "mobx"
import CharacterCollection from "../character/CharacterCollection"
import { CharacterStatus } from "../character/types"
import { createCommandHandler } from "../fchat/helpers"
import { LoginResponse } from "../flist/FListApiService"
import RootStore from "../RootStore"
import { Friendship } from "./types"

export default class ChatStore {
  @observable identity = ""
  @observable.ref characters: string[] = []
  @observable.ref friendships: Friendship[] = []
  bookmarks = new CharacterCollection(this.root.characterStore)
  admins = new CharacterCollection(this.root.characterStore)
  ignored = new CharacterCollection(this.root.characterStore)

  constructor(private root: RootStore) {}

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
  }

  isFriend = (name: string) =>
    this.friendships.some((entry) => entry.them === name)

  isAdmin = (name: string) => this.admins.has(name)

  isIgnored = (name: string) => this.ignored.has(name)

  updateStatus = (status: CharacterStatus, statusmsg: string) => {
    this.root.socketStore.sendSocketCommand("STA", { status, statusmsg })
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

    RTB: () => {
      // TODO
    },
  })
}
