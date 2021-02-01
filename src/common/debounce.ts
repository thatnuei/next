export function debounce<A extends unknown[]>(
	time: number,
	fn: (...args: A) => void,
) {
	let timeout: ReturnType<typeof setTimeout>

	return (...args: A) => {
		if (timeout) clearTimeout(timeout)

		timeout = setTimeout(() => {
			fn(...args)
		}, time)
	}
}
