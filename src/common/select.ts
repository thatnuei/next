type CaseMap = {
  [_ in string | number | symbol]?: (...args: any[]) => void
}

const select = <Cases extends CaseMap>(
  value: string | number | symbol,
  cases: Cases,
) => {
  const handler = cases[value as keyof Cases]

  if (handler) {
    handler()
    return true
  }

  return false
}
export default select
