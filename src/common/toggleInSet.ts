interface SetLike<T> {
	has(item: T): boolean
	add(item: T): void
	delete(item: T): void
}

export function toggleInSet<T>(set: SetLike<T>, item: T) {
	if (set.has(item)) {
		set.delete(item)
	} else {
		set.add(item)
	}
}
