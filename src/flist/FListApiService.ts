import { fetchJson } from "../network/fetchJson"

export const getTicketUrl = "https://www.f-list.net/json/getApiTicket.php"

export const characterListUrl =
  "https://www.f-list.net/json/api/character-list.php"

type ApiResponse<D> = { error: string } | { error: "" } & D

export type GetTicketResponse = ApiResponse<{
  ticket: string
  characters: string[]
  bookmarks: { name: string }[]

  // should consider clientsidedly converting this to a more intuitive structure later
  // e.g. { us: string, them: string }
  friends: {
    /** Our character */
    dest_name: string
    /** Their character */
    source_name: string
  }[]
}>

export type CharacterListResponse = ApiResponse<{
  characters: string[]
}>

export default class FListApiService {
  private account = ""
  // store the password so we can get a new ticket if needed
  // the F-list team told me this was safe, and this is being done in 3.0 desktop,
  // so I'll take their word for it
  private password = ""
  private ticket = ""

  constructor(private fetch = fetchJson) {}

  async authenticate(account: string, password: string) {
    const res = await this.fetch<GetTicketResponse>(getTicketUrl, {
      method: "post",
      body: { account, password },
    })

    if (!("ticket" in res)) {
      throw new Error(res.error)
    }

    this.account = account
    this.password = password
    this.ticket = res.ticket

    return { ...res, characters: res.characters.sort() }
  }

  clearCredentials() {
    this.account = ""
    this.password = ""
    this.ticket = ""
  }

  async refetchTicket() {
    await this.authenticate(this.account, this.password)
  }

  async fetchCharacters() {
    const { account, ticket } = this
    const res = await this.fetch<CharacterListResponse>(characterListUrl, {
      method: "post",
      body: { account, ticket },
    })

    if (!("characters" in res)) {
      throw new Error(res.error)
    }

    return { characters: res.characters.sort() }
  }
}
