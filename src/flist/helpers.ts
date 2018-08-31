export function getAvatarUrl(name: string) {
  return `https://static.f-list.net/images/avatar/${encodeURI(name.toLowerCase())}.png`
}
