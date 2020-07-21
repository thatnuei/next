import { concat, filter, without } from "lodash/fp"
import { observable } from "micro-observables"
import { AppStore } from "../app/AppStore"
import { UserStore } from "../app/UserStore"
import { memoize } from "../helpers/common/memoize"
import { createBoundCommandHandler } from "../socket/commandHelpers"
import { SocketHandler } from "../socket/SocketHandler"
import { CharacterModel } from "./CharacterModel"

type Friendship = {
  us: string
  them: string
}

export class CharacterStore {
  readonly friends = observable<readonly Friendship[]>([])
  readonly bookmarks = observable<readonly string[]>([])
  readonly ignored = observable<readonly string[]>([])
  readonly admins = observable<readonly string[]>([])

  constructor(
    socket: SocketHandler,
    private readonly userStore: UserStore,
    private readonly appStore: AppStore,
  ) {
    socket.commandStream.listen(this.handleCommand)
  }

  private getCharacterById = memoize((id: string, name: string) => {
    return new CharacterModel(id, name)
  })

  getCharacter = (name: string) =>
    this.getCharacterById(name.toLowerCase(), name)

  handleCommand = createBoundCommandHandler(this, {
    async IDN() {
      const result = await this.userStore.getFriendsAndBookmarks()

      const friends = result.friendlist.map((entry) => ({
        us: entry.source,
        them: entry.dest,
      }))

      this.bookmarks.set(result.bookmarklist)
      this.friends.set(friends)
    },

    IGN(params) {
      if (params.action === "init" || params.action === "list") {
        this.ignored.set(params.characters)
      }
      if (params.action === "add") {
        this.ignored.update(concat(params.character))
      }
      if (params.action === "delete") {
        this.ignored.update(without([params.character]))
      }
    },

    ADL({ ops }) {
      this.admins.set(ops)
    },

    LIS({ characters }) {
      for (const [name, gender, status, statusMessage] of characters) {
        const char = this.getCharacter(name)
        char.name.set(name)
        char.gender.set(gender)
        char.status.set({ type: status, text: statusMessage })
      }
    },

    NLN({ identity: name, gender, status }) {
      const char = this.getCharacter(name)
      char.name.set(name)
      char.gender.set(gender)
      char.status.set({ type: status, text: "" })
    },

    FLN({ character: name }) {
      const char = this.getCharacter(name)
      char.status.set({ type: "offline", text: "" })
    },

    STA({ character: name, status, statusmsg }) {
      const char = this.getCharacter(name)
      char.status.set({ type: status, text: statusmsg })
    },

    RTB(params) {
      if (params.type === "trackadd") {
        this.bookmarks.update(concat(params.name))
        // show toast
      }

      if (params.type === "trackrem") {
        this.bookmarks.update(without([params.name]))
        // show toast
      }

      if (params.type === "friendadd") {
        this.friends.update(
          concat({ us: this.appStore.identity.get(), them: params.name }),
        )
        // show toast
      }

      if (params.type === "friendremove") {
        this.friends.update(filter((it) => it.them === params.name))
        // show toast
      }
    },
  })
}
