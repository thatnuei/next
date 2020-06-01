import { useMemo } from "react"

export function useBoolActions([value, setValue]: [
  boolean,
  (newValue: boolean | ((prev: boolean) => boolean)) => void,
]) {
  const actions = useMemo(
    () => ({
      set: (value: boolean) => setValue(value),
      toggle: () => setValue((v) => !v),
      on: () => setValue(true),
      off: () => setValue(false),
    }),
    [setValue],
  )

  return [value, actions] as const
}
