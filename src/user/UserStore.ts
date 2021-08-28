import { pick } from "lodash-es"
import { raise } from "../common/raise"
import { toError } from "../common/toError"
import { authenticate } from "../flist/authenticate"
import { fetchFlist } from "../flist/fetchFlist"
import type { AuthUser, LoginCredentials } from "../flist/types"
import { Store } from "../state/store"

type FriendsAndBookmarksResponse = {
  readonly friendlist: ReadonlyArray<{
    /** our character */
    source: string
    /** their character */
    dest: string
  }>
  readonly bookmarklist: readonly string[]
}

type TicketCredentials = {
  account: string
  ticket: string
}

export class UserStore extends Store<{
  identity: string | undefined
  characters: string[]
}> {
  #user: AuthUser | undefined

  constructor() {
    super({ identity: undefined, characters: [] })
  }

  get #userTicketCredentials(): TicketCredentials | undefined {
    return this.#user ? pick(this.#user, ["account", "ticket"]) : undefined
  }

  async login(credentials: LoginCredentials) {
    this.#user = await authenticate(credentials)
    this.merge({
      characters: this.#user.characters,
    })
  }

  logout() {
    this.#user = undefined
    this.merge({ identity: undefined, characters: [] })
  }

  async withFreshCredentials<Result>(
    block: (credentials: TicketCredentials) => Promise<Result>,
  ): Promise<Result> {
    if (!this.#user || !this.#userTicketCredentials) {
      raise(`Not logged in`)
    }

    try {
      return await block(this.#userTicketCredentials)
    } catch (error) {
      const message = toError(error).message

      if (message.includes("Invalid ticket")) {
        await this.login(pick(this.#user, ["account", "password"]))
        return await block(this.#userTicketCredentials)
      }

      throw error
    }
  }

  setIdentity(identity: string) {
    this.merge({ identity })
  }

  async addBookmark(args: { name: string }) {
    await this.withFreshCredentials(async (creds) => {
      await fetchFlist(`/api/bookmark-add.php`, { ...args, ...creds })
    })
  }

  async removeBookmark(args: { name: string }) {
    await this.withFreshCredentials(async (creds) => {
      await fetchFlist(`/api/bookmark-remove.php`, { ...args, ...creds })
    })
  }

  async getFriendsAndBookmarks() {
    await this.withFreshCredentials(async (creds) => {
      await fetchFlist<FriendsAndBookmarksResponse>(
        `/api/friend-bookmark-lists.php`,
        {
          ...creds,
          friendlist: "true",
          bookmarklist: "true",
        },
      )
    })
  }

  async getMemo(args: { name: string }) {
    return this.withFreshCredentials(async (creds) => {
      const res = await fetchFlist<{ note: string | null }>(
        "/api/character-memo-get2.php",
        { ...creds, target: args.name },
      )
      return res.note ?? ""
    })
  }

  async setMemo({ name, ...params }: { name: string; note: string }) {
    await this.withFreshCredentials(async (creds) => {
      await fetchFlist("/api/character-memo-save.php", {
        ...creds,
        ...params,
        target_name: name,
      })
    })
  }
}
