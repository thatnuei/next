import { useRef } from "react"

const noValue = Symbol()

export function useInstanceValue<V>(getValue: () => V): V {
	const ref = useRef<V | typeof noValue>(noValue)
	if (ref.current === noValue) {
		ref.current = getValue()
	}
	return ref.current
}
