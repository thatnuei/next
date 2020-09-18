export function dictSet<K extends PropertyKey, V>(key: K, value: V) {
	return <O extends Record<K, V>>(dict: O) => ({ ...dict, [key]: value })
}

export function dictRemove<K extends PropertyKey>(key: K) {
	return (dict: Record<K, unknown>) => {
		const { [key]: _, ...rest } = dict
		return rest
	}
}
