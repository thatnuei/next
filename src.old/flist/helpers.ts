export function getAvatarUrl(name: string) {
  return `https://static.f-list.net/images/avatar/${encodeURI(name.toLowerCase())}.png`
}

export function getProfileUrl(name: string) {
  return `https://www.f-list.net/c/${encodeURI(name.toLowerCase())}`
}
