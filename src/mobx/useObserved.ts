import { reaction } from "mobx"
import { useEffect, useState } from "react"

export function useObserved<T>(getValue: () => T): T {
  const [value, setValue] = useState(getValue)
  useEffect(() => reaction(getValue, setValue), [getValue])
  return value
}
