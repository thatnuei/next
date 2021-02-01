import { useRef } from "react"

const noValue = Symbol()

/**
 * Use this to create a value once for the lifetime of the component
 */
export function useInstanceValue<T>(createValue: () => T) {
	const ref = useRef<T | typeof noValue>(noValue)
	if (ref.current === noValue) {
		ref.current = createValue()
	}
	return ref.current
}
