import { compareLower } from "../common/compareLower"
import { raise } from "../common/raise"

export type LoginCredentials = {
  account: string
  password: string
}

export type AuthenticateResponse = {
  ticket: string
  characters: string[]
}

export function createFListApi() {
  let lastCredentials: LoginCredentials | undefined

  async function authenticate(
    creds: LoginCredentials,
  ): Promise<AuthenticateResponse> {
    const body = new FormData()
    body.set("account", creds.account)
    body.set("password", creds.password)
    body.set("no_friends", "true")
    body.set("no_bookmarks", "true")

    const res = await fetch("https://www.f-list.net/json/getApiTicket.php", {
      method: "post",
      body,
    })
    const data = await res.json()

    if (data.error) {
      raise(data.error)
    }

    lastCredentials = creds

    data.characters.sort(compareLower)
    return data
  }

  return { authenticate }
}
