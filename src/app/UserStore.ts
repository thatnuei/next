import { observable } from "micro-observables"
import { raise } from "../helpers/common/raise"
import { Dict } from "../helpers/common/types"
import { fetchJson } from "../network/fetchJson"

export type AuthenticateArgs = { account: string; password: string }
type AuthenticateResponse = { ticket: string; characters: string[] }

export type FriendsAndBookmarksResponse = {
  bookmarklist: string[]
  friendlist: Friendship[]
}

type Friendship = {
  /** Your character */
  source: string
  /** Their character */
  dest: string
}

const ticketExpireTime = 1000 * 60 * 5

export class UserStore {
  readonly userData = observable({
    account: "",
    ticket: "",
    characters: [] as string[],
  })

  private lastTicketFetchTime = 0
  private password = ""

  login = async ({ account, password }: AuthenticateArgs) => {
    const { ticket, characters } = await this.authenticate({
      account,
      password,
    })

    this.userData.set({ account, ticket, characters })
    this.password = password
    this.lastTicketFetchTime = Date.now()
  }

  addBookmark = async (args: { name: string }) => {
    const creds = await this.getFreshAuthCredentials()
    await apiFetch(`/api/bookmark-add.php`, { ...args, ...creds })
  }

  removeBookmark = async (args: { name: string }) => {
    const creds = await this.getFreshAuthCredentials()
    await apiFetch(`/api/bookmark-remove.php`, { ...args, ...creds })
  }

  getFriendsAndBookmarks = async () => {
    const creds = await this.getFreshAuthCredentials()
    return apiFetch<FriendsAndBookmarksResponse>(
      `/api/friend-bookmark-lists.php`,
      { ...creds, bookmarklist: true, friendlist: true },
    )
  }

  getMemo = async (args: { name: string }) => {
    const creds = await this.getFreshAuthCredentials()

    const res = await apiFetch<{ note: string | null }>(
      "/api/character-memo-get2.php",
      { ...creds, target: args.name },
    )

    return res.note ?? ""
  }

  setMemo = async ({ name, ...params }: { name: string; note: string }) => {
    const creds = await this.getFreshAuthCredentials()

    await apiFetch("/api/character-memo-save.php", {
      ...creds,
      ...params,
      target_name: name,
    })
  }

  private authenticate(args: AuthenticateArgs) {
    return apiFetch<AuthenticateResponse>("/getApiTicket.php", {
      ...args,
      no_friends: true,
      no_bookmarks: true,
    })
  }

  private async getFreshAuthCredentials() {
    if (Date.now() - this.lastTicketFetchTime > ticketExpireTime) {
      const userData = this.userData.get()

      const { ticket } = await this.authenticate({
        account: userData.account,
        password: this.password,
      })

      this.userData.set({ ...userData, ticket })
    }

    const { account, ticket } = this.userData.get()
    return { account, ticket }
  }
}

async function apiFetch<T>(endpoint: string, body: Dict<unknown>): Promise<T> {
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
