export function memoize<K, V>(fn: (key: K) => V) {
  const values = new Map<K, V>()

  return function getMemoizedValue(key: K) {
    if (values.has(key)) return values.get(key) as V
    const value = fn(key)
    values.set(key, value)
    return value
  }
}
