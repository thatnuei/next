import { pick } from "lodash-es"
import { toError } from "../common/toError"
import { authenticate } from "./authenticate"
import { fetchFlist } from "./fetchFlist"
import type { AuthUser, LoginCredentials } from "./types"

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

export type FListApi = ReturnType<typeof createFListApi>

export function createFListApi(initialUser: AuthUser) {
  let user = initialUser

  const api = {
    get user() {
      return user
    },

    async login(credentials: LoginCredentials) {
      user = await authenticate(credentials)
    },

    async tryWithValidTicket<Result>(
      block: (credentials: TicketCredentials) => Promise<Result>,
    ): Promise<Result> {
      try {
        return await block(pick(user, ["account", "ticket"]))
      } catch (error) {
        const message = toError(error).message

        if (message.includes("Invalid ticket")) {
          user = await authenticate(pick(user, ["account", "password"]))

          return await block(pick(user, ["account", "ticket"]))
        }

        throw error
      }
    },

    async addBookmark(args: { name: string }) {
      await api.tryWithValidTicket(async (creds) => {
        await fetchFlist(`/api/bookmark-add.php`, { ...args, ...creds })
      })
    },

    async removeBookmark(args: { name: string }) {
      await api.tryWithValidTicket(async (creds) => {
        await fetchFlist(`/api/bookmark-remove.php`, { ...args, ...creds })
      })
    },

    async getFriendsAndBookmarks() {
      return api.tryWithValidTicket((creds) => {
        return fetchFlist<FriendsAndBookmarksResponse>(
          `/api/friend-bookmark-lists.php`,
          {
            ...creds,
            friendlist: "true",
            bookmarklist: "true",
          },
        )
      })
    },

    async getMemo(args: { name: string }) {
      return api.tryWithValidTicket(async (creds) => {
        const res = await fetchFlist<{ note: string | null }>(
          "/api/character-memo-get2.php",
          { ...creds, target: args.name },
        )
        return res.note ?? ""
      })
    },

    async setMemo({ name, ...params }: { name: string; note: string }) {
      await api.tryWithValidTicket(async (creds) => {
        await fetchFlist("/api/character-memo-save.php", {
          ...creds,
          ...params,
          target_name: name,
        })
      })
    },
  }

  return api
}
