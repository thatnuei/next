import { pick } from "lodash-es"
import { raise } from "../common/raise"
import { toError } from "../common/toError"
import type { Dict, NonEmptyArray } from "../common/types"
import { fetchJson } from "../network/fetchJson"
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

type GetApiTicketResponse = {
  characters: NonEmptyArray<string>
  ticket: string
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

export function createFListApi(fetch = fetchFromFlist) {
  let user: AuthUser | undefined

  async function authenticate(args: LoginCredentials): Promise<AuthUser> {
    const response = await fetch<GetApiTicketResponse>("/getApiTicket.php", {
      ...args,
      no_friends: true,
      no_bookmarks: true,
    })
    return { ...response, account: args.account, password: args.password }
  }

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
        await fetch(`/api/bookmark-add.php`, { ...args, ...creds })
      })
    },

    async removeBookmark(args: { name: string }) {
      await api.tryWithValidTicket(async (creds) => {
        await fetch(`/api/bookmark-remove.php`, { ...args, ...creds })
      })
    },

    async getFriendsAndBookmarks() {
      return api.tryWithValidTicket((creds) => {
        return fetch<FriendsAndBookmarksResponse>(
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
        const res = await fetch<{ note: string | null }>(
          "/api/character-memo-get2.php",
          { ...creds, target: args.name },
        )
        return res.note ?? ""
      })
    },

    async setMemo({ name, ...params }: { name: string; note: string }) {
      await api.tryWithValidTicket(async (creds) => {
        await fetch("/api/character-memo-save.php", {
          ...creds,
          ...params,
          target_name: name,
        })
      })
    },
  }

  return api
}

async function fetchFromFlist<T>(
  endpoint: string,
  body: Dict<unknown>,
): Promise<T> {
  endpoint = endpoint.replace(/^\/+/, "")

  const data = await fetchJson<T & { error?: string }>(
    `https://www.f-list.net/json/${endpoint}`,
    {
      method: "post",
      body,
    },
  )

  return data.error ? raise(data.error) : data
}
