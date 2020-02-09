export type LoginCredentials = {
  account: string
  password: string
}

export type AuthenticateResponse = {
  ticket: string[]
  characters: string[]
}

export async function authenticate({
  account,
  password,
}: LoginCredentials): Promise<AuthenticateResponse> {
  const body = new FormData()
  body.set("account", account)
  body.set("password", password)
  body.set("no_friends", "true")
  body.set("no_bookmarks", "true")

  const res = await fetch("https://www.f-list.net/json/getApiTicket.php", {
    method: "post",
    body,
  })
  const data = await res.json()

  if (data.error) {
    throw new Error(data.error)
  }

  return data
}
