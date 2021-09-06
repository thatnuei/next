import { pick } from "lodash-es"
import { raise } from "../common/raise"
import { toError } from "../common/toError"
import type { NonEmptyArray } from "../common/types"
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

export type TicketCredentials = {
  account: string
  ticket: string
}

export type LoginResponse = {
  account: string
  ticket: string
  characters: NonEmptyArray<string>
}

export type FListApi = ReturnType<typeof createFListApi>

export function createFListApi() {
  let user: AuthUser | undefined

  const api = {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
      user = await authenticate(credentials)
      return {
        account: user.account,
        ticket: user.ticket,
        characters: user.characters,
      }
    },

    async reauthenticate(): Promise<TicketCredentials> {
      if (user === undefined) {
        raise("not logged in")
      }
      user = await authenticate(pick(user, ["account", "password"]))
      return {
        account: user.account,
        ticket: user.ticket,
      }
    },

    async tryWithValidTicket<Result>(
      block: (credentials: TicketCredentials) => Promise<Result>,
    ): Promise<Result> {
      if (!user) {
        raise("not logged in")
      }

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
