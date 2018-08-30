export function loadAuthData() {
  const account = localStorage.getItem("account")
  const ticket = localStorage.getItem("ticket")
  return { account, ticket }
}

export function saveAuthData(account: string, ticket: string) {
  localStorage.setItem("account", account)
  localStorage.setItem("ticket", ticket)
}
