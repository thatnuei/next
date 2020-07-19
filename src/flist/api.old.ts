import { sortBy, toLower } from "lodash/fp"
import { assert } from "../helpers/common/assert"
import { fetchJson } from "./fetchJson"

export type LoginCredentials = {
  account: string
  password: string
}

export type AuthenticateResponse = {
  ticket: string
  characters: string[]
}

export type FriendsAndBookmarksResponse = {
  bookmarklist: string[]
  friendlist: FriendListEntry[]
}

type FriendListEntry = {
  /** Your character */
  source: string
  /** Their character */
  dest: string
}

type AuthState = {
  account: string
  ticket: string
  password: string // i don't like storing this but the f-list team said this was fine ¯\_(ツ)_/¯
  ticketTimestamp: number
}

export type FListApi = ReturnType<typeof createFListApi>

const ticketExpireTime = 1000 * 60 * 5

async function refetchTicket(currentState: AuthState) {
  const ticketTimestamp = Date.now()

  const data = await fetchJson<AuthenticateResponse>(
    "https://www.f-list.net/json/getApiTicket.php",
    {
      method: "post",
      body: {
        account: currentState.account,
        password: currentState.password,
        no_friends: true,
        no_bookmarks: true,
        no_characters: true,
        no_default_character: true,
      },
    },
  )

  return {
    ...currentState,
    ticket: data.ticket,
    ticketTimestamp,
  }
}

export function createFListApi() {
  // using a factory function instead of a class to keep hard privacy on this,
  // since it contains some sensitive info
  let authState: AuthState | undefined

  async function validateAuthState(): Promise<AuthState> {
    assert(authState, "Not authenticated")
    if (Date.now() - authState.ticketTimestamp >= ticketExpireTime) {
      authState = await refetchTicket(authState)
    }
    return authState
  }

  async function fetchWithAuth<T>(url: string, body?: object) {
    const state = await validateAuthState()
    return fetchJson<T>(url, {
      method: "post", // every API request is a post request
      body: { account: state.account, ticket: state.ticket, ...body },
    })
  }

  async function authenticate(
    creds: LoginCredentials,
  ): Promise<AuthenticateResponse> {
    const data = await fetchJson<AuthenticateResponse>(
      "https://www.f-list.net/json/getApiTicket.php",
      {
        method: "post",
        body: {
          account: creds.account,
          password: creds.password,
          no_friends: true,
          no_bookmarks: true,
        },
      },
    )

    authState = {
      ...creds,
      ticket: data.ticket,
      ticketTimestamp: Date.now(),
    }

    return {
      ...data,
      characters: sortBy(toLower, data.characters),
    }
  }

  async function addBookmark({ name }: { name: string }) {
    await fetchWithAuth("https://www.f-list.net/json/api/bookmark-add.php", {
      name,
    })
  }

  async function removeBookmark({ name }: { name: string }) {
    await fetchWithAuth("https://www.f-list.net/json/api/bookmark-remove.php", {
      name,
    })
  }

  async function getFriendsAndBookmarks(): Promise<
    FriendsAndBookmarksResponse
  > {
    return fetchWithAuth(
      "https://www.f-list.net/json/api/friend-bookmark-lists.php",
      {
        bookmarklist: true,
        friendlist: true,
      },
    )
  }

  async function getMemo({ name }: { name: string }): Promise<string> {
    const res = await fetchWithAuth<{ note: string | null }>(
      "https://www.f-list.net/json/api/character-memo-get2.php",
      { target: name },
    )
    return res.note || ""
  }

  async function setMemo({ name, note }: { name: string; note: string }) {
    await fetchWithAuth(
      "https://www.f-list.net/json/api/character-memo-save.php",
      { target_name: name, note },
    )
  }

  return {
    authenticate,
    addBookmark,
    removeBookmark,
    getFriendsAndBookmarks,
    getMemo,
    setMemo,
  }
}
