function fromEntries<K extends keyof any, V>(pairs: [K, V][]): Record<K, V> {
  const result: any = {}
  for (const [key, value] of pairs) {
    result[key] = value
  }
  return result
}
export default fromEntries
