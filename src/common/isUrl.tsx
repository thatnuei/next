export function isUrl(text: string): boolean {
  try {
    new URL(text)
    return true
  } catch (error) {
    return false
  }
}
