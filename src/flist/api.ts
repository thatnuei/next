import { fetchJson } from "../network/fetchJson"

export async function authenticate(account: string, password: string) {
  const getTicketEndpoint = "https://www.f-list.net/json/getApiTicket.php"

  type ApiTicketResponse = {
    ticket: string
    characters: string[]
  }

  const res = await fetchJson<ApiTicketResponse>(getTicketEndpoint, {
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

export async function fetchCharacters(account: string, ticket: string) {
  const characterListEndpoint =
    "https://www.f-list.net/json/api/character-list.php"

  type CharacterListResponse = {
    characters: string[]
  }

  const res = await fetchJson<CharacterListResponse>(characterListEndpoint, {
    method: "post",
    body: { account, ticket },
  })

  return { characters: res.characters.sort() }
}
