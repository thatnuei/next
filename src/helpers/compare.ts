type CompareFn<T> = (a: T, b: T) => number

export function compare<T>(
	getComparedValue: (value: T) => unknown,
	{ reverse = false } = {},
): CompareFn<T> {
	return (first: T, second: T) => {
		let firstValue = getComparedValue(first)
		let secondValue = getComparedValue(second)

		if (reverse) {
			;[firstValue, secondValue] = [secondValue, firstValue]
		}

		if (typeof firstValue === "number" && typeof secondValue === "number") {
			return firstValue - secondValue
		}

		return String(firstValue).localeCompare(String(secondValue))
	}
}
