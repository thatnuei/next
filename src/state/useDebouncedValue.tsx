import { useEffect, useState } from "react"

export function useDebouncedValue<T>(value: T, duration = 500): T {
	const [currentValue, setCurrentValue] = useState(value)

	useEffect(() => {
		const timeout = setTimeout(() => {
			setCurrentValue(value)
		}, duration)
		return () => clearTimeout(timeout)
	}, [duration, value])

	return currentValue
}
