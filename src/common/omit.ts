/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
export function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const keySet = new Set<PropertyKey>(keys)
  const result: any = {}
  for (const key in obj) {
    if (!keySet.has(key)) {
      result[key] = obj[key]
    }
  }
  return result
}
