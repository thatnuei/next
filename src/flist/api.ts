import { assert } from "../common/assert"
import { compareLower } from "../common/compareLower"
import { fetchJson } from "../network/fetchJson"

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

// the actual expiration time is 30 minutes,
// but we'll do 25 to be conservative
const ticketExpireTime = 1000 * 60 * 25

async function refetchTicket(currentState: AuthState) {
  const ticketTimestamp = Date.now()

  const data = await fetchJson("https://www.f-list.net/json/getApiTicket.php", {
    method: "post",
    body: {
      account: currentState.account,
      password: currentState.password,
      no_friends: "true",
      no_bookmarks: "true",
    },
  })

  return {
    ...currentState,
    ticket: data.ticket,
    ticketTimestamp,
  }
}

export function createFListApi() {
  let authState: AuthState | undefined

  async function validateAuthState(): Promise<AuthState> {
    assert(authState, "Not authenticated")
    if (Date.now() - authState.ticketTimestamp >= ticketExpireTime) {
      authState = await refetchTicket(authState)
    }
    return authState
  }

  async function fetchWithAuth(url: string, body?: object) {
    const state = await validateAuthState()
    return fetchJson(url, {
      method: "post", // every API request is a post request
      body: { account: state.account, ticket: state.ticket, ...body },
    })
  }

  async function authenticate(
    creds: LoginCredentials,
  ): Promise<AuthenticateResponse> {
    const data = await fetchJson(
      "https://www.f-list.net/json/getApiTicket.php",
      {
        method: "post",
        body: {
          account: creds.account,
          password: creds.password,
          no_friends: "true",
          no_bookmarks: "true",
        },
      },
    )

    authState = {
      ...creds,
      ticket: data.ticket,
      ticketTimestamp: Date.now(),
    }

    data.characters.sort(compareLower)
    return data
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

  return { authenticate, addBookmark, removeBookmark, getFriendsAndBookmarks }
}
