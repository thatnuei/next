function pick<O, K extends keyof O>(obj: O, ...keys: K[]): Pick<O, K> {
  const result: any = {}
  for (const key of keys) {
    result[key] = obj[key]
  }
  return result
}
export default pick
