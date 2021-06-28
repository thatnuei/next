export function without<T>(items: readonly T[], removedValue: T) {
	return items.filter((item) => item !== removedValue)
}

without.curried =
	<T>(removedValue: T) =>
	(items: readonly T[]) =>
		without(items, removedValue)
