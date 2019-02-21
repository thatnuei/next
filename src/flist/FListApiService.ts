import { fetchJson } from "../network/fetchJson"

export const getTicketUrl = "https://www.f-list.net/json/getApiTicket.php"

export const characterListUrl =
  "https://www.f-list.net/json/api/character-list.php"

export type ApiTicketResponse = {
  ticket: string
  characters: string[]
}

export type CharacterListResponse = {
  characters: string[]
}

export default class FListApiService {
  constructor(private fetch = fetchJson) {}

  async authenticate(account: string, password: string) {
    const res = await this.fetch<ApiTicketResponse>(getTicketUrl, {
      method: "post",
      body: {
        account,
        password,
        no_friends: true,
        no_bookmarks: true,
      },
    })

    return { ...res, characters: res.characters.sort() }
  }

  async fetchCharacters(account: string, ticket: string) {
    const res = await this.fetch<CharacterListResponse>(characterListUrl, {
      method: "post",
      body: { account, ticket },
    })

    return { characters: res.characters.sort() }
  }
}
