import { useMemo } from "react"
import useToggleState from "../state/hooks/useToggleState"

export default function useModal(initialVisible?: boolean) {
  const state = useToggleState(initialVisible)
  return useMemo(
    () => ({
      visible: state.on,
      onClose: state.disable,
      show: state.enable,
      toggle: state.toggle,
    }),
    [state.disable, state.enable, state.on, state.toggle],
  )
}
