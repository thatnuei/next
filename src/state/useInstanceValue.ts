import { useRef } from "react"

export default function useInstanceValue<T>(init: () => T) {
  const ref = useRef<T>()
  if (!ref.current) ref.current = init()
  return ref.current
}
