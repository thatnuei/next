import { useState } from "react"
import mod from "../../common/helpers/mod"

export default function useCycle<T>(values: readonly T[]) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const current = values[mod(currentIndex, values.length)]
  const next = () => setCurrentIndex((i) => i + 1)
  return { current, next }
}