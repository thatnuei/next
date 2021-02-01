import { useEffect, useRef } from "react"

/**
 * Use this when you want to read a value in useEffect/useCallback
 * without it being a dependency
 */
export function useEffectRef<T>(value: T): { readonly current: T } {
	const ref = useRef(value)
	useEffect(() => {
		ref.current = value
	})
	return ref
}
