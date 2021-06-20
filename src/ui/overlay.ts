import type { SwitchState} from "../react/switch";
import { useSwitch, useSwitchControlled } from "../react/switch"

export interface OverlayProps {
	isVisible: boolean
	onDismiss: () => void
}

export const useOverlay = (init?: boolean) => getOverlayState(useSwitch(init))

export const useOverlayControlled = (
	...args: Parameters<typeof useSwitchControlled>
) => getOverlayState(useSwitchControlled(...args))

export function getOverlayState(state: SwitchState) {
	return {
		...state,
		props: { isVisible: state.value, onDismiss: state.hide },
	}
}
