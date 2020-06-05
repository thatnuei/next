import { compose } from "lodash/fp"
import { SwitchState, useSwitch, useSwitchControlled } from "../react/switch"

export type OverlayProps = {
  isVisible: boolean
  onDismiss: () => void
}

export const useOverlay = compose(getOverlayState, useSwitch)

export const useOverlayControlled = compose(
  getOverlayState,
  useSwitchControlled,
)

export function getOverlayState(state: SwitchState) {
  return {
    ...state,
    props: { isVisible: state.value, onDismiss: state.hide },
  }
}
