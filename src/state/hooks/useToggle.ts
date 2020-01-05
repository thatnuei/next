import { useMemo, useState } from "react"

export function useToggle(initialState = false) {
  const [on, setOn] = useState(initialState)

  const actions = useMemo(
    () => ({
      toggle: () => setOn((v) => !v),
      enable: () => setOn(true),
      disable: () => setOn(false),
      set: (value: boolean) => setOn(value),
    }),
    [],
  )

  return [on, actions] as const
}
