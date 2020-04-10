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

type AuthState = {
  account: string
  ticket: string
  password: string // i don't like storing this but the f-list team said this was fine ¯\_(ツ)_/¯
  ticketTimestamp: number
}

// the actual expiration time is 30 minutes,
// but we'll do 25 to be conservative
const ticketExpireTime = 1000 * 60 * 25

export function createFListApi() {
  let authState: AuthState | undefined

  async function validateAuthState(): Promise<AuthState> {
    assert(authState, "Not authenticated")

    if (Date.now() - authState.ticketTimestamp >= ticketExpireTime) {
      await refetchTicket(authState)
    }

    return authState
  }

  async function refetchTicket(currentState: AuthState) {
    const ticketTimestamp = Date.now()

    const data = await fetchJson(
      "https://www.f-list.net/json/getApiTicket.php",
      {
        method: "post",
        body: {
          account: currentState.account,
          password: currentState.password,
          no_friends: "true",
          no_bookmarks: "true",
        },
      },
    )

    authState = {
      ...currentState,
      ticket: data.ticket,
      ticketTimestamp,
    }
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
    const state = await validateAuthState()

    await fetchJson("https://www.f-list.net/json/api/bookmark-add.php", {
      method: "post",
      body: { account: state.account, ticket: state.ticket, name },
    })
  }

  async function removeBookmark({ name }: { name: string }) {
    const state = await validateAuthState()

    await fetchJson("https://www.f-list.net/json/api/bookmark-remove.php", {
      method: "post",
      body: { account: state.account, ticket: state.ticket, name },
    })
  }

  return { authenticate, addBookmark, removeBookmark }
}
