import { useState } from "react"
import mod from "../common/mod"

export default function useCycle<T>(items: T[]) {
  if (items.length === 0) {
    throw new Error("useCycle() received empty array")
  }

  const [index, setIndex] = useState(0)

  return {
    current: items[mod(index, items.length)],
    next: () => setIndex((i) => i + 1),
    prev: () => setIndex((i) => i - 1),
    setIndex,
  }
}
