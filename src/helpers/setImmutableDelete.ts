export function setImmutableDelete<T>(value: T) {
	return (set: Set<T>) => {
		const newSet = new Set(set)
		newSet.delete(value)
		return newSet
	}
}
