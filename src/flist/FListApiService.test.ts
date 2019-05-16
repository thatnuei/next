import { FetchJsonOptions } from "../network/fetchJson"
import FListApiService, {
  CharacterListResponse,
  characterListUrl,
  GetTicketResponse,
  getTicketUrl,
} from "./FListApiService"

const account = "awesome"
const password = "password"
const ticket = "fhdjklafshjdlokafsdhjklhfal"
const userCharacters = ["a", "b"]

const mockFetch = async (
  url: string,
  options: FetchJsonOptions = {},
): Promise<any> => {
  if (options.method !== "post") {
    throw new Error("all requests must be post requests")
  }

  if (url === getTicketUrl) {
    if (
      options.body &&
      options.body.account === account &&
      options.body.password === password
    ) {
      const res: GetTicketResponse = {
        characters: userCharacters,
        ticket: ticket,
        friends: [],
        bookmarks: [],
        error: "",
      }
      return res
    }

    throw new Error("Invalid credentials")
  }

  if (url === characterListUrl) {
    if (
      options.body &&
      options.body.account === account &&
      options.body.ticket === ticket
    ) {
      const res: CharacterListResponse = {
        characters: userCharacters,
        error: "",
      }
      return res
    }

    throw new Error("Invalid credentials")
  }

  throw new Error("Network error")
}

const api = new FListApiService(mockFetch)

test("authenticate", async () => {
  const res = await api.authenticate(account, password)
  expect(res.characters).toEqual(userCharacters)
  expect(res.ticket).toBe(ticket)
})

test("character list", async () => {
  await api.authenticate(account, password)
  const res = await api.fetchCharacters()
  expect(res.characters).toEqual(userCharacters)
})
