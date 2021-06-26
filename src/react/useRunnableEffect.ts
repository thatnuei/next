import type { EffectCallback } from "react"
import { useEffect, useReducer } from "react"

export function useRunnableEffect(callback: EffectCallback, deps: unknown[]) {
	const [key, run] = useReducer(() => ({}), {})
	useEffect(callback, [key, ...deps]) // eslint-disable-line react-hooks/exhaustive-deps
	return run
}
