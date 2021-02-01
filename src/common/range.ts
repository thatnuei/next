export function range(min: number, max?: number) {
	if (max === undefined) {
		max = min
		min = 0
	}

	const length = max - min
	const result = Array<number>(length)

	for (let i = 0; i < length; i++) {
		result[i] = i + min
	}

	return result
}
