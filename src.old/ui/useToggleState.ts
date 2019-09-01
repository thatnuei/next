import { useCallback, useState } from "react"

export default function useToggleState(initialState = false) {
  const [on, setOn] = useState(initialState)

  const enable = useCallback(() => setOn(true), [])
  const disable = useCallback(() => setOn(false), [])
  const toggle = useCallback(() => setOn((on) => !on), [])

  return { on, enable, disable, toggle }
}
