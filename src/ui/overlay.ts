import { compose } from "lodash/fp"
import {
  useVisibleState,
  useVisibleStateControlled,
  VisibleState,
} from "../react/useVisibleState"

export type OverlayProps = {
  isVisible: boolean
  onDismiss: () => void
}

export const useOverlay = compose(getOverlayState, useVisibleState)

export const useOverlayControlled = compose(
  getOverlayState,
  useVisibleStateControlled,
)

export function getOverlayState(state: VisibleState) {
  return {
    ...state,
    props: { isVisible: state.isVisible, onDismiss: state.hide },
  }
}
