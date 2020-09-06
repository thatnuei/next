export const unique = <T>(
  values: Iterable<T>,
  getKey?: (item: T) => unknown,
) => {
  if (!getKey) return [...new Set(values)]

  const keyedValues = new Map<unknown, T>()
  for (const value of values) {
    const key = getKey(value)
    if (!keyedValues.has(key)) {
      keyedValues.set(key, value)
    }
  }
  return [...keyedValues.values()]
}
