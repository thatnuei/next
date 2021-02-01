export function memoize<K, V, Args extends unknown[]>(
	fn: (key: K, ...args: Args) => V,
) {
	const values = new Map<K, V>()

	return function getMemoizedValue(key: K, ...args: Args) {
		if (values.has(key)) return values.get(key) as V
		const value = fn(key, ...args)
		values.set(key, value)
		return value
	}
}
