const lowerEncode = (text: string) => encodeURI(text.toLowerCase())

export function getAvatarUrl(name: string) {
  return `https://static.f-list.net/images/avatar/${lowerEncode(name)}.png`
}

export function getProfileUrl(name: string) {
  return `https://www.f-list.net/c/${lowerEncode(name)}`
}

export function getIconUrl(name: string) {
  return `https://static.f-list.net/images/eicon/${lowerEncode(name)}.gif`
}
