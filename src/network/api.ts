import { fetchJson } from "./fetchJson"

export function fetchTicket(account: string, password: string) {
  const getTicketEndpoint = "https://www.f-list.net/json/getApiTicket.php"

  type ApiTicketResponse = {
    ticket: string
    characters: string[]
  }

  return fetchJson<ApiTicketResponse>(getTicketEndpoint, {
    method: "post",
    body: {
      account,
      password,
      no_friends: true,
      no_bookmarks: true,
    },
  })
}

export function fetchCharacters(account: string, ticket: string) {
  const characterListEndpoint = "https://www.f-list.net/json/api/character-list.php"

  type CharacterListResponse = {
    characters: string[]
  }

  return fetchJson<CharacterListResponse>(characterListEndpoint, {
    method: "post",
    body: { account, ticket },
  })
}

export function getAvatarUrl(name: string) {
  return `https://static.f-list.net/images/avatar/${encodeURI(name.toLowerCase())}.png`
}
