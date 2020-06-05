import { useCallback, useState } from "react"
import { UseStateReturn } from "./types"

export type VisibleState = ReturnType<typeof useVisibleStateControlled>

export type VisibleStateControlledArgs = Parameters<
  typeof useVisibleStateControlled
>

export function useVisibleState(initialVisible = false) {
  return useVisibleStateControlled(useState(initialVisible))
}

export function useVisibleStateControlled([
  isVisible,
  setVisible,
]: UseStateReturn<boolean>) {
  const show = useCallback(() => setVisible(true), [setVisible])
  const hide = useCallback(() => setVisible(false), [setVisible])
  const toggle = useCallback(() => setVisible((v) => !v), [setVisible])
  return { isVisible, show, hide, toggle }
}
