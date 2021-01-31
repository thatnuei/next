import { useCallback, useState } from "react"
import { UseStateReturn } from "./types"

export type SwitchState = ReturnType<typeof useSwitchControlled>

export function useSwitch(initial = false) {
	return useSwitchControlled(useState(initial))
}

export function useSwitchControlled([value, set]: UseStateReturn<boolean>) {
	const enable = useCallback(() => set(true), [set])
	const disable = useCallback(() => set(false), [set])
	const toggle = useCallback(() => set((v) => !v), [set])
	return {
		value,
		set,
		enable,
		disable,
		toggle,
		// aliases, for when this is used to represent visibility
		show: enable,
		hide: disable,
	}
}
